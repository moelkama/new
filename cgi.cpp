#include "cgi.hpp"

cgi::cgi()
{
    this->env = NULL;
    this->args = new char*[3];
    this->args[2] = NULL;
}

// cgi::cgi(const cgi& other)
// {
    // if (other.env)
    // {
    //     this->env = new char*[other.env_m.size() + 1];
    //     this->env[other.env_m.size()] = NULL;
    // }
    // else
    //     this->env = NULL;
    // for (int i = 0; other->env[i]; i++)
    //     this->env[i] = other.env[i];
// }

cgi::~cgi()
{
    // this->env_m.clear();
    // for (unsigned int i = 0; this->env && this->env[i]; i++)
    //     delete this->env[i];
    // for (unsigned int i = 0; this->args && this->args[i]; i++)
    //     delete this->args[i];
    // delete[] this->env;
    // delete[] this->args;
    close(this->in_fd);
    close(this->out_fd);
}

std::string cgi::get_cgi()
{
    // std::string extension;
    // size_t      find;

    // find = this->script.find(".");
    // // if (find == std::string::npos)
    // //     throw ("not found");
    // extension = this->script.substr(find);
    return ("/usr/bin/php");
}

void    cgi::cgi_init(std::string input, request req) //server config
{
    std::string uri;
    std::string query_string;
    size_t      find;
    int         idx = 0;

    this->input = input;
    this->in_fd = open(input.c_str(), O_RDONLY);
    // this->output = this->creat_file();
    // this->out_fd = open(this->output.c_str(), O_RDWR | O_APPEND);
    uri = req.get_path();
    find = uri.find("?");
    this->script = uri.substr(0, find);
    /////
    this->env_m["SERVER_NAME"] = SERVER_NAME;/////
    this->env_m["GATEWAY_INTERFACE"] = "CGI/1.1";
    this->env_m["SERVER_PROTOCOL"] = HTTP_VERSION;
    this->env_m["SERVER_PORT"] = "port";////
    this->env_m["CONTENT_TYPE"] = req.get_header("Content-Type");
    this->env_m["PATH_INFO"] = this->script;
    this->env_m["CONTENT_LENGTH"] =  "10";///
    this->env_m["REQUEST_METHOD"] = req.get_method();
    this->env_m["SCRIPT_FILENAME"] = this->script;
    this->env_m["REMOTE_HOST"] = req.get_header("Host");
    if (find != std::string::npos)
        this->env_m["QUERY_STRING"] = uri.substr(find);
    ////
    this->env = new char*[this->env_m.size() + 1];
    for (std::map<std::string, std::string>::iterator it = this->env_m.begin(); it != this->env_m.end(); it++)
        this->env[idx++] = strdup((it->first + "=" + it->second).c_str());
    this->env[idx] = NULL;
    ////
    this->args[1] = strdup(script.c_str());
    this->args[0] = strdup(this->get_cgi().c_str());
}

void    cgi::cgi_execute()
{
    int     fd[2];
    int     status;

    pipe(fd);
    this->out_fd = fd[0];///
    this->pid = fork();
    if (this->pid == -1)
        throw (500);
    if (!this->pid)
    {
        dup2(this->in_fd, 0);
        dup2(this->out_fd, 1);
        close(this->in_fd);
        close(this->out_fd);
        this->args[1] = strdup("./script.php");/////
        execve(this->args[0], this->args, this->env);
        exit(1);
    }
    else
    {
        waitpid(this->pid, &status, 0);
        // remove(this->input.c_str());
        std::cout<<"DOOOOOOOOOOOON"<<std::endl;
    }
}