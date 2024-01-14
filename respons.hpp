#ifndef RESPONS_HPP
#define RESPONS_HPP

#include "macro.hpp"
#include <fstream>
#include "request.hpp"
#include "./last/config_file/configFile.hpp"
#include "post.hpp"

class respons
{
private:
    std::pair<int, std::string>         Status;
    std::string                         Body;
    std::map<std::string, std::string>  headers;
public:
    void    set_Date();
    void    set_Body(std::string body);
    void    set_header(std::string key, std::string value);
    respons(const one_server& server);
    void    set_Status(int st, const one_server& server);
    std::string prepare_respons();
    ~respons();
    void    set_post_info(const post& p);
};

#endif