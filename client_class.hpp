#ifndef CLIENT_CLASS_HPP
#define CLIENT_CLASS_HPP

#include "post.hpp"
#include "request.hpp"
#include "respons.hpp"
#include "cgi.hpp"
#include "./last/config_file/configFile.hpp"

class   client
{
private:
public:
    request request;
    respons respons;
    post    post;
    cgi     cgi;
    client(one_server server);
};

#endif