(function() {
    "use strict";
    
    var _ = require('underscore');
    var fs = require('fs');

    
    var __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) { 
                if (i in this && this[i] === item) 
                    return i;
            }
            return -1; 
    };
    
    var writeToFile = function(fname, text) {        
        fs.writeFile(fname, text + "\n", function (err) {
          if (err) return console.log(err);
        });
    }
    
    var appendToFile = function(fname, text) {        
        fs.appendFile(fname, text + "\n", function (err) {
          if (err) return console.log(err);
        });
    }
    
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
                         '/styles/menu/dropdown.css',
                         '/styles/style.css',
                         '/styles/menu/default_advanced.css',
                         '/styles/menu/horizontal-centering.css',
                         ],
                scripts: ["<!-- jQuery -->\n<script src=\"//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js\"></script>\n<script>window.jQuery || document.write('<script src=\"/vendor/jquery.js\"><\\/script>')</script>", 
                          '/vendor/log.js', 
                          '/vendor/modernizr.js', 
                          '/scripts/script.js']                
            },
            require: require,
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
            writeToFile: writeToFile,
            appendToFile: appendToFile,
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
            },
            // ToDo: Probably not needed anymore.
            getPublicationGroups: function() {
                var pubs = this.getCollection("publications").toJSON();
                if (!pubs) console.log("pubs is undefined");
                var pubsByTag = _.groupBy(pubs, function(pub) {
                    //writeToFile("pub.json", JSON.stringify(pub)); 
                    if (pub.tag && pub.tag.length > 0) {
                        return pub.tag[0];
                    }
                    else {
                        return null;
                    }
                });
                                
                //writeToFile("pubGroups.json", JSON.stringify(pubsByTag)); 
                
                return pubsByTag;
            }
        },
        collections: {
            // All pages, by default, have the "default" layout and are hidden from the menu.
            pages: function () {
                return this.getCollection("html")
                           .findAllLive()
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "default",
                                                        menuHidden: true });
                            });
            },
            // All auto generated documents (paging) should be hidden from the menu. The 'paged' plugin
            // set the menuHidden property to true to all pages.
            auto: function () {
                return this.getCollection("pages")
                           .findAllLive({ isPagedAuto: { $eq: true } })
                           .on("add", function (model) {
                                model.setMeta({ menuHidden: true });
                            });
            },            
            news: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: "news" }, [{ date: -1 }])
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "pr" });
                            });
            },
            // This collection contains only publications. By convention these are located in subdirectories 
            // of the "publications" directory.
            publications: function () {
                var noIndexHtml = function(model) {
                    var m = model.toJSON();
                    var isPub = /^publications[\/\\]./.test(m.relativeOutDirPath);
                    var isIndexHtml = m.basename === "index" 
                    return isPub && !isIndexHtml;
                };
                
                return this.getCollection("html")
                           .createLiveChildCollection()
                           .setFilter("no_index_html", noIndexHtml)
                           .setComparator([{ date: 1 }])
                           .on("add", function (model) {
                                model.setMetaDefaults({ layout: "publication" });
                                var editions = model.getMeta("editions");  
                               appendToFile("pub.json", model.toJSON().url);
//                               appendToFile("pub.json", JSON.stringify(editions));
                               editions = model.toJSON().editions;
                               //appendToFile("pub.json", JSON.stringify(editions));
                                if (editions) {
                                    var currentEdition = _.first(editions);
                                    _.each(editions, function(e) {
                                        if (e.number > currentEdition.number) {
                                            currentEdition = e;
                                        }
                                    });
                                    
//                                    appendToFile("pub.json", "CurrentEdition:" + JSON.stringify(currentEdition));

                                    model.setMeta("currentEdition", currentEdition);
                                    model.setMeta("date", currentEdition.date);
                                }                               
                            });
            },
            publicationCategories: function() {
                return this.getCollection("html")
                           .findAllLive({ relativeOutPath: /^publications\/.*\/index.html/ }, [{ menuOrder: 1 }]) 
            },
            boards: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutPath: /^boards\/.*\/index.html/ }, [{ from: 1 }])
                           .on("add", function (model) {                
                               var period = model.getMeta("period");
                               var from = model.getMeta("from");
                               var until = model.getMeta("until");
                               var menuTitle = period + " (" + from + "-" + until + ")";
                               var title = "Περίοδος " + menuTitle;
                               model.setMeta("title", title);
                               model.setMeta("menuHidden", false );
                               model.setMeta("menuTitle", menuTitle);
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
