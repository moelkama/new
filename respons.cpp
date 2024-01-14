#include "respons.hpp"

respons::respons(const one_server& server)
{
    this->Status.first = 201;
    this->Status.second = "Created";
    set_header(SERVER, server._server_name);
}

void    respons::set_header(std::string key, std::string value)
{
    this->headers[key] = value;
}

void    respons::set_Date()
{
    time_t now = time(NULL);
    struct tm *gmNow = gmtime(&now);

    char dateStr[100];
    strftime(dateStr, sizeof(dateStr), "%a, %d %b %Y %H:%M:%S GMT", gmNow);
    set_header(DATE, dateStr);
}

void    respons::set_Body(std::string body)
{
    this->Body = body;
    set_header(CONTENT_LENGTH, std::to_string(this->Body.length()));
}

void    respons::set_Status(int st, const one_server& server)
{
    std::string     reasons[] = {"OK", "Bad Request", "Not Found", "Not Allowed", "Forbiden", "Request-URI Too Long", "Internal Server Error", "Not Implemented"};
    int             status[] = {200, 400, 404, 405, 403, 414, 500, 501};
    unsigned int    i;
    std::string     line;

    this->Status.first = st;
    for (i = 0; i < sizeof(status)/ sizeof(int); i++)
        if (status[i] == st)
            break;
    this->Status.second = reasons[i];
    std::ifstream    error_page(server.get_error_page(std::to_string(st)));
    if (error_page.is_open())
    {
        while (!error_page.eof())
        {
            std::getline(error_page, line);
            this->Body.append(line + LINE_SEPARATOR);
        }
        set_header(CONTENT_TYPE, "text/html");
        set_header(CONTENT_LENGTH, std::to_string(this->Body.length()));
    }
}

void    respons::set_post_info(const post& p)
{
    this->set_header(CONTENT_TYPE, "application/json");
    this->Body = "{\n\t\"name\": \"";
    this->Body += p.get_out_name();
    this->Body += "\",\n\t\"location\": \"";
    this->Body += p.get_url() + p.get_out_name();
    this->Body += "\"\n}";
    this->set_header(CONTENT_LENGTH, std::to_string(this->Body.length()));
}

std::string respons::prepare_respons()
{
    std::string respons;

    //respens line
    respons = HTTP_VERSION;
    respons += " " + std::to_string(this->Status.first);
    respons += " " + this->Status.second;
    //heders
    set_Date();
    std::map<std::string, std::string>::iterator  it = this->headers.begin();
    std::map<std::string, std::string>::iterator  eit = this->headers.end();
    while (it != eit)
    {
        respons += std::string(LINE_SEPARATOR) + it->first + HEDER_SEPARATOR + it->second;
        it++;
    }
    //body
    respons += BODY_SEPARATOR + this->Body;
    return (respons);
}

respons::~respons(){}