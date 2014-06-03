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
                description: "H Εταιρεία Λευκαδικών Μελετών είναι το μοναδικό επιστημονικό σωματείο της Λευκάδας",
                // ToDo:
                keywords: "λευκάδα, λευκαδικά, επιστημονική εταιρεία, επιστημονικό σωματείο, lefkas, history, ιστορία",
                styles: ['/vendor/normalize.css', 
                         '/vendor/h5bp.css', 
                         '/styles/style.css',
                         '/styles/purecssmenu.css'
                         ],
                scripts: ["<!-- jQuery -->\n<script src=\"//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js\"></script>\n<script>window.jQuery || document.write('<script src=\"/vendor/jquery.js\"><\\/script>')</script>", 
                          '/vendor/log.js', 
                          '/vendor/modernizr.js', 
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
            },
            trace: {
                pageFlag: false,  
                menuFlag: false,
                page: function(msg) {
                    if (this.pageFlag)
                        console.log(msg);
                },
                menu: function(msg) {
                    if (this.menuFlag)
                        console.log(msg);
                }
            },
            imagesRoot: "/images/",
            getImage: function(page) {
                var imagePath;
                if (!page) {
                    imagePath = this.imagesRoot + "not_available.png";
                }
                else if (!page.image) {
                    imagePath = this.imagesRoot + page.relativeBase + ".png";
                }
                else {
                   imagePath = page.image;
                }
                                                
                return imagePath;
            },
            getThumb: function(page) {
                var imagePath;
                if (!page) {
                    imagePath = this.imagesRoot + "not_available.png";
                }
                else if (!page.thumbnail) {
                    imagePath = this.imagesRoot + page.relativeBase + "-th.png";
                }
                else {
                    imagePath = page.thumbnail;
                }
                                                
                return imagePath;
            }
        },
        collections: {
            pages: function () {
                return this.getCollection("html")
                           .findAllLive()
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "default" });
                            });
            },
            // Set menuHiddden to true for auto generated documents (paging).                                
            auto: function () {
                return this.getCollection("pages")
                           .findAllLive({ isPagedAuto: { $eq: true } })
                           .on("add", function (model) {
                                model.setMetaDefaults({ menuHidden: true });
                            });
            },            
            news: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: "news" }, [{ date: -1 }])
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "pr", menuHidden: true });
                            });
            },
            publications: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: "publications" }, [{ date: -1 }])                           
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "publication", 
                                                        menuHidden: true });
                                var editions = model.getMeta("editions");                                
                                if (editions) {
                                    var currentEdition = editions[0];
                                    for (var e in editions) {
                                        if (e.number > currentEdition.number) {
                                            currentEdition = e;
                                        }
                                    }

                                    model.setMeta("currentEdition", currentEdition);
                                    model.setMeta("date", currentEdition.date);
                                }                               
                            });
            },
            boards: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: "boards" }, [{ until: -1 }])
                           .on("add", function (model) {
                                //model.setMetaDefaults({ layout: "pr", menuHidden: true });
                            });
            }
        },
        environments: {
            development: {
                port: 9777,
                templateData: {
                    site: {
                        url: "http://localhost:9777"
                    }
                }
            },
            atWork: {
                port: 9777,
                templateData: {
                    site: {
                        url: "http://172.18.27.159:9777"
                    }
                }
            },
            demo: {
                templateData: {
                    site: {
                        url: "http://ronto.net/"
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
        },
        plugins: {
            menu: {
                menuOptions: {
                   //optimize: true,
                   //skipEmpty: true,
                   skipFiles: /\.(js|styl|css)/
                }
            },            
            datefromfilename: {
                //removeDate: false,
                //dateRegExp: /\b(\d{4})-(\d{2})-(\d{2})-/
            },
            moment: {
                formats: [
                    {raw: 'date', format: 'YYYY', formatted: 'publicationDate'},
                    {raw: 'date', format: 'DD/MM/YYYY', formatted: 'newsDate'}
                ]
            },            
            sitemap: {                
                //cachetime: 600000,
                changefreq: 'always',
                priority: 0.5,
                filePath: 'sitemap.xml'
            },
            marked: {
                tables: true
            }
        }
    };

    module.exports = docpadConfig;

}).call(this);
