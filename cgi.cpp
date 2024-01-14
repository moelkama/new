#include "cgi.hpp"
#include "client_class.hpp"

cgi::cgi()
{
    this->env = NULL;
    this->args = new char*[3];
    this->args[0] = NULL;
    this->args[1] = NULL;
    this->args[2] = NULL;
}

cgi::cgi(const cgi& other)
{
    this->env = NULL;
    this->args = NULL;
    this->operator=(other);
}

cgi&    cgi::operator=(const cgi& other)
{
    delete[] this->args;
    delete[] this->env;
    this->env_m.clear();
    this->args = new char*[3];
    this->args[0] = NULL;
    this->args[1] = NULL;
    this->args[2] = NULL;
    this->env = NULL;
    if (other.env)
    {
        this->env = new char*[other.env_m.size() + 1];
        this->env[other.env_m.size()] = NULL;
        for (int i = 0; other.env[i]; i++)
            this->env[i] = strdup(other.env[i]);
    }
    for (int i = 0; other.args[i]; i++)
        this->args[i] = strdup(other.args[i]);
    return (*this);
}

cgi::~cgi()
{
    this->env_m.clear();
    delete[] this->env;
    delete[] this->args;
    close(this->in_fd);
    close(this->out_fd);
}

void cgi::set_cgi(const Location& location, const std::string& path)
{
    std::string extension;
    size_t      point;

    point = path.find_last_of(".");
    if (point == std::string::npos)
        return ;
    extension = path.substr(point);
    this->cgi_cmd = location.get_cgi(extension);
    this->script = path; ///
}

std::string    create_file_name()
{
    struct timeval  Now;

    gettimeofday(&Now, NULL);
    return (std::to_string(Now.tv_sec) + "-" + std::to_string(Now.tv_usec));
}

void    cgi::cgi_init(const one_server& server, const client& client) //server config
{
    Location    location;
    struct stat fileStat;
    std::string uri;
    std::string path;
    size_t      find;
    int         idx = 0;

    this->output = client.post.get_upload_path() + create_file_name();
    this->input = client.post.get_upload_path() + client.post.get_out_name();
    stat(this->input.c_str(), &fileStat);
    this->in_fd = open(this->input.c_str(), O_RDONLY);//freeopen 
    this->out_fd = open(this->output.c_str(), O_RDWR | O_CREAT, 0777);///
    uri = client.request.get_path();
    find = uri.find("?");
    path = uri.substr(0, find);
    location = server.get_location(path);
    set_cgi(location, path);
    /////
    this->env_m["SERVER_NAME"] = server._server_name;
    this->env_m["GATEWAY_INTERFACE"] = "CGI/1.1";
    this->env_m["SERVER_PROTOCOL"] = HTTP_VERSION;
    this->env_m["SERVER_PORT"] = std::to_string(server.listen);
    this->env_m["CONTENT_TYPE"] = client.request.get_header("Content-Type");//// get
    this->env_m["PATH_INFO"] = server.get_upload_path(path);/////
    this->env_m["CONTENT_LENGTH"] = std::to_string(fileStat.st_size);
    this->env_m["REQUEST_METHOD"] = client.request.get_method();
    this->env_m["SCRIPT_FILENAME"] = server.get_upload_path(path);///
    if (find != std::string::npos)
        this->env_m["QUERY_STRING"] = uri.substr(find + 1, uri.find("#"));
    ////
    this->env = new char*[this->env_m.size() + 1];
    for (std::map<std::string, std::string>::const_iterator it = this->env_m.cbegin(); it != this->env_m.cend(); it++)
        this->env[idx++] = strdup((it->first + "=" + it->second).c_str());
    this->env[idx] = NULL;
    ////
    this->args[0] = strdup(this->cgi_cmd.c_str());
    this->args[1] = strdup(this->env_m["PATH_INFO"].c_str());
}

void    cgi::cgi_execute()
{
    this->pid = fork();
    if (this->pid == -1)
    {
        close(this->out_fd);
        close(this->in_fd);
        this->status = 1;
        return ;
    }
    if (!this->pid)
    {
        dup2(this->in_fd, 0);
        dup2(this->out_fd, 1);
        close(this->in_fd);
        close(this->out_fd);
        // std::cout<<"args[0]:"<<args[0]<<"$"<<std::endl;
        // std::cout<<"args[1]:"<<args[1]<<"$"<<std::endl;
        // if (!access(this->args[0], X_OK))
            execve(this->args[0], this->args, this->env);
        exit(1);
    }
    else
    {
        waitpid(this->pid, &this->status, 0);
        remove(this->input.c_str());
    }
    close(this->out_fd);
    close(this->in_fd);
}

std::string cgi::cgi_out(one_server& server, client& client)
{
    std::string out_put;

    this->cgi_init(server, client);
    this->cgi_execute();
    std::cout<<"cgi status :"<<this->status<<"$"<<std::endl;
    // if (this->status == 0)
    // {
        struct stat     fileStat;
        std::ifstream   in(this->output.c_str());
        std::string     line;

        stat(this->output.c_str(), &fileStat);
        client.respons.set_Status(200, server);
        client.respons.set_header(CONTENT_TYPE, "text/html");
        client.respons.set_header(CONTENT_LENGTH, std::to_string(fileStat.st_size));
        while (!in.eof())
        {
            std::getline(in, line);
            out_put.append(line + '\n');///
        }
        std::cout<<"out:"<<out_put<<std::endl;
    // }
    // else
        //remove(this->output.c_str());
    //     client.respons.set_Status(500, server);
    remove(this->output.c_str());
    return (out_put);
}