#ifndef CGI_HPP
#define CGI_HPP

#include <map>
#include "request.hpp"
#include <fcntl.h>
#include <unistd.h>
#include "./last/config_file/configFile.hpp"
#include <sys/stat.h>
class   client;

class cgi
{
private:
    std::map<std::string, std::string>  env_m;
    std::string                         script;
    std::string                         input;
    std::string                         output;
    int                                 in_fd;
    char                                **env;
    char                                **args;
    pid_t                               pid;
    int                                 status;
    int                                 out_fd;
    std::string                         cgi_cmd;
public:
    cgi();
    cgi(const cgi& other);
    cgi&    operator=(const cgi& other);
    ~cgi();
    void        cgi_init(const one_server& server, const client& client);
    void        set_cgi(const Location& location, const std::string& path);
    void        cgi_execute();
    std::string cgi_out(one_server& server, client& client);
};

#endif