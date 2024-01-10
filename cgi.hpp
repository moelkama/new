#ifndef CGI_HPP
#define CGI_HPP

#include <map>
#include "request.hpp"
#include <fcntl.h>
#include <unistd.h>

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
public:
    int                                 out_fd;
    cgi();
    // cgi(const cgi& other);
    ~cgi();
    void        cgi_init(std::string input, request req);
    std::string get_cgi();
    void        cgi_execute();
};

#endif