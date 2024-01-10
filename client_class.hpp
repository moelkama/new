#ifndef CLIENT_CLASS_HPP
#define CLIENT_CLASS_HPP

#include "post.hpp"
#include "request.hpp"
#include "respons.hpp"
#include "cgi.hpp"

class   client
{
private:
public:
    request request;
    respons respons;
    post    post;
    cgi     cgi;
    client();
    std::string cgi_out()
    {
        char    buffer[BUFFER_SIZE + 1];
        int     x;

        this->cgi.cgi_init(this->post.get_out_name(), this->request);
        this->cgi.cgi_execute();
        bzero(buffer, BUFFER_SIZE + 1);
        x = read(this->cgi.out_fd, buffer, BUFFER_SIZE);
        return (buffer);
    }
};

#endif