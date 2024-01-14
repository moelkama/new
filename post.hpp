#ifndef POST_HPP
#define POST_HPP

#include "macro.hpp"
#include <sys/time.h>
#include <fstream>
#include <fcntl.h>
#include <unistd.h>
#include "request.hpp"
#include "./last/config_file/configFile.hpp"
#include <sys/stat.h>

class post
{
private:
    std::fstream    out;
    bool            first_time;
    size_t          max_size;
    std::string     rest;
    size_t          chunked_size;
    //
    std::string     boundary;
    std::string     brest;
    std::map<std::string, std::string> headers;
    bool            h;
    //
    void            create_file(std::string extension);
    //
    std::string     content_type;
    std::string     content_length;
    std::string     transfer_encoding;
    ///
    short           mode;
    std::string     out_name;
    std::string     url;
    std::string     upload_path;
public:
    bool            is_cgi;
    post();
    void        parse_upload_path(std::string upload_path);
    void        init(request& req, one_server& server);
    void        chunked(std::string body);
    void        boundarry(std::string body);
    void        raw(std::string content);
    void        post_request(request& req, one_server& server);
    std::string get_out_name() const;
    std::string get_upload_path() const;
    std::string get_url() const;
};

#endif