(function() {
    "use strict";
    
    var __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) { 
                if (i in this && this[i] === item) 
                    return i;
            }
            return -1; 
    };

    var docpadConfig = {
        templateData: {
            site: {
                url: "http://www.lefkadika.gr",
                oldUrls: ['www.website.com', 'website.herokuapp.com'],
                title: "Εταιρεία Λευκαδικών Μελετών",
                // ToDo:
                description: "When your website appears in search results in say Google, the text here will be shown underneath your website's title.",
                // ToDo:
                keywords: "place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website",
                styles: [//'/vendor/normalize.css', 
                         //'/vendor/h5bp.css', 
                         '/styles/style.css'],
                scripts: ["<!-- jQuery -->\n<script src=\"//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js\"></script>\n<script>window.jQuery || document.write('<script src=\"/vendor/jquery.js\"><\\/script>')</script>", 
                          '/vendor/log.js', 
                          //'/vendor/modernizr.js', 
                          '/scripts/script.js']
            },
            getPreparedTitle: function() {
                if (this.document.title) {
                  return "" + this.document.title + " | " + this.site.title;
                } else {
                  return this.site.title;
                }
            },
            getPreparedDescription: function() {
                return this.document.description || this.site.description;
            },
            getPreparedKeywords: function() {
                return this.site.keywords.concat(this.document.keywords || [])
                                         .join(', ');
            }
        },
        collections: {
            menuItems: function () {
                return this.getCollection("html")
                           .findAllLive({ menu: true });
            },
            news: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: "news" }, [{ date: -1 }])
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "news" });
                            });
            }
        },
        environments: {
            development: {
                templateData: {
                    site: {
                        url: false
                    }
                }
            }
        },
        events: {
            serverExtend: function(opts) {
                var docpad, latestConfig, newUrl, oldUrls, server;
                server = opts.server;
                docpad = this.docpad;
                latestConfig = docpad.getConfig();
                oldUrls = latestConfig.templateData.site.oldUrls || [];
                newUrl = latestConfig.templateData.site.url;
                return server.use(function(req, res, next) {
                    var _ref;
                    if (_ref = req.headers.host, __indexOf.call(oldUrls, _ref) >= 0) {
                        return res.redirect(newUrl + req.url, 301);
                    } else {
                        return next();
                    }
                });
            }
        }
    };

    module.exports = docpadConfig;

}).call(this);
