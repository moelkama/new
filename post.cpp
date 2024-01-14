#include "post.hpp"

post::post()
{
    this->upload_path = "/tmp/";
    this->mode = 0;
    this->chunked_size = 0;
    this->first_time = true;
    this->h = false;
    this->is_cgi = false;
}

std::string post::get_out_name() const
{
    return (this->out_name);
}

std::string post::get_upload_path() const
{
    return (this->upload_path);
}

std::string post::get_url() const
{
    return (this->url);
}

void    post::create_file(std::string content_type)
{
    std::string     applications[] = {"text/plain", "text/html", "image/jpeg", "application/pdf", "audio/mpeg", "video/mp4"};
    std::string     extensions[] = {"txt", "html", "jpeg", "pdf", "mp3", "mp4"};
    std::string     extension;
    unsigned int    i;
    struct timeval  Now;

    for (i = 0; i < sizeof(applications)/ sizeof(std::string); i++)
        if (applications[i] == content_type)
            break;
    extension = extensions[i];
    // do
    // {
        gettimeofday(&Now, NULL);
        this->out_name = std::to_string(Now.tv_sec) + "-" + std::to_string(Now.tv_usec) + "." + extension;
    // } while (access(file_name.c_str(), F_OK) != -1);
    this->out.open(this->upload_path + this->out_name, std::ios::out);
}

void    post::boundarry(std::string body)
{
    std::string line;
    size_t      end_line;
    size_t      header_s;

    body = this->brest + body;
    while ((end_line = body.find(LINE_SEPARATOR)) != std::string::npos)
    {
        line = body.substr(0, end_line);
        body = body.substr(end_line + strlen(LINE_SEPARATOR));
        if (line == std::string("--").append(this->boundary).append("--"))
        {
            this->out.close();
            throw (201);
        }
        if (line == std::string("--").append(this->boundary))
            this->h = true;
        else if (line.empty())
        {
            this->h = false;
            this->out.close();
            this->create_file(this->headers[CONTENT_TYPE]);
        }
        else if (this->h)
        {
            header_s = line.find(HEDER_SEPARATOR);
            if (header_s == std::string::npos)
                throw (400);// HEADER SEPARATOR NOT FOUND
            this->headers[line.substr(0, header_s)] = line.substr(header_s + strlen(HEDER_SEPARATOR));
        }
        else
            this->out<<line;
    }
    this->brest = body;
}

int hexCharToInt(char hexChar)
{
    if (hexChar >= '0' && hexChar <= '9')
        return (hexChar - '0');
    else if (hexChar >= 'A' && hexChar <= 'F')
      return (hexChar - 'A' + 10);
    else if (hexChar >= 'a' && hexChar <= 'f')
      return (hexChar - 'a' + 10);
    throw (400); //bad hexdecimal number;
}

size_t  hex_to_dec(std::string n)
{
    size_t  result;

    result = 0;
    for (size_t i = 0; i < n.length(); ++i)
        result = result * 16 + hexCharToInt(n[i]);
    return result;
}

void    post::chunked(std::string body)
{
    size_t      hex_end;
    std::string n;

    this->rest += body;
    body = "";
    if (this->chunked_size == 0)
    {
        hex_end = this->rest.find(LINE_SEPARATOR);
        if (hex_end == std::string::npos) //"\r\n" not found
        {
            if (this->rest.length() >= 16) // hexdecemal number too long
                throw (400);
            return ;
        }
        n = this->rest.substr(0, hex_end); // parse n important
        this->chunked_size = hex_to_dec(n);
        if (this->chunked_size == 0)
        {
            this->out.close();
            throw (201);
        }
        this->rest = this->rest.substr(hex_end + strlen(LINE_SEPARATOR));
    }
    if (this->chunked_size >= this->rest.length()/*important ==>'\0' inside buffer*/)
    {
        if (this->mode == 3)
            this->boundarry(this->rest);
        else
            this->out<<this->rest;
        this->chunked_size -= this->rest.length();
        this->rest = "";
    }
    else
    {
        if (this->mode == 3)
            this->boundarry(this->rest.substr(0, this->chunked_size));
        else
            this->out<<this->rest.substr(0, this->chunked_size);
        this->rest = this->rest.substr(this->chunked_size + strlen(LINE_SEPARATOR));
        this->chunked_size = 0;
        this->chunked(body);
    }
}

void    post::raw(std::string content)
{
    if (this->max_size < content.length())
        content = content.substr(0, this->max_size);
    this->out<<content;
    this->max_size -= content.length();
    if (this->max_size == 0)
    {
        this->out.close();
        throw (201);
    }
}

void    post::parse_upload_path(std::string upload_path)
{
    struct stat path_info;

    if (stat(upload_path.c_str(), &path_info) != 0)
        throw 404;
    if (S_ISDIR(path_info.st_mode))
    {
        this->upload_path = upload_path;
    }
    else if (S_ISREG(path_info.st_mode))
    {
        this->is_cgi = true;
        //check file extention on cgi
    }
}

void    post::init(request& req,  one_server& server)
{
    size_t      point;

    this->url = req.get_path().substr(0, req.get_path().find("?"));
    this->first_time = false;
    this->content_type = req.get_header(CONTENT_TYPE);
    this->content_length = req.get_header(CONTENT_LENGTH);
    if (this->content_type.empty())
        throw (400);
    this->transfer_encoding = req.get_header(TRANSFER_ENCODING);
    if (this->content_type.substr(0, this->content_type.find(";")) == MULTIPART)
        this->boundary = this->content_type.substr(this->content_type.find("boundary=") + strlen("boundary="));
    //location
    this->parse_upload_path(server.get_upload_path(this->url));
    if (!this->is_cgi && !server.get_location(this->url)._upload)
        throw (403);
    //mode
    //chunked
    if (!this->transfer_encoding.empty())
    {
        if (!this->content_length.empty())
            throw (400);
        if (this->transfer_encoding != "chunked")
            throw (405); //not allowed
        if (this->boundary.empty())
        {
            this->mode = 1;
            this->create_file(this->content_type);
        }
        else
            this->mode = 3;
        return ;
    }
    //boundary
    if (!this->boundary.empty())
    {
        if (!this->content_length.empty())
            throw (400);
        this->mode = 2;
        return ;
    }
    //raw
    if (this->content_length.empty())
        throw (400);
    this->create_file(this->content_type);
    this->max_size = atoi(this->content_length.c_str());
}

void post::post_request(request& req, one_server& server)
{
    std::string content;

    content = req.get_body();
    if (this->first_time)
        this->init(req, server);
    if (this->mode == 1 || this->mode == 3)
        this->chunked(content);
    else if (this->mode == 2)
        this->boundarry(content);
    else
        this->raw(content);
}