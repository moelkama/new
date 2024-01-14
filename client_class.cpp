#include "client_class.hpp"

client::client(one_server server) : respons(server)
{}

// std::string client::cgi_out()
// {
//     char    buffer[BUFFER_SIZE + 1];
//     int     x;

//     this->cgi.cgi_init(this->post.get_out_name(), this->request);
//     this->cgi.cgi_execute();
//     bzero(buffer, BUFFER_SIZE + 1);
//     x = read(this->cgi.out_fd, buffer, BUFFER_SIZE);
//     return (buffer);
// }