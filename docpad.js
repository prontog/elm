/*jslint nomen:true, vars:true, devel:true, browser:true, white:true */
/*globals require:true, _:true, module:true */

(function() {
    "use strict";
    
    var _ = require("underscore");
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var eco = require("eco");
    
    var __indexOf = [].indexOf || function(item) {
            var i, l;
            for (i = 0, l = this.length; i < l; i++) { 
                if (i in this && this[i] === item) { 
                    return i;
                }
            }
            return -1; 
    };
    
    var writeToFile = function(fname, text) {        
        fs.writeFile(fname, text + "\n", function (err) {
          if (err) { return console.log(err); }
        });
    };
    
    var appendToFile = function(fname, text) {        
        fs.appendFile(fname, text + "\n", function (err) {
          if (err) { return console.log(err); }
        });
    };
    
    var asJSON = function(obj) {
        return JSON.stringify(obj);
    };
    
    var getObjMembers = function(obj) {
        var retStr = "Properties---------\n";
        retStr += _.keys(obj).join("\n");
        retStr += "\nFunctions---------\n";
        retStr += _.functions(obj).join("\n");
        return retStr;
    };
    
    // Creates a RegExp based on the origPath regular expression. On non-Windows machines it 
    // uses the provided string without modifying it. On Windows it tries to normalize the
    // path first. If the regular expression contains backslashes the results can vary.
    var createPathRegExp = function(origPath) {        
        var normalizedPath = origPath;
        if (/^Windows/i.test(os.type())) {
            normalizedPath = path.normalize(origPath).replace(/\\/g, "\\\\");
        }
        
        return new RegExp(normalizedPath);
    };
    
    var helpers = {
        getIndexHtmlFrom: function(path, comparator) {            
            //var re = new RegExp("^" + path + "\/.*\/index.html");
            var re = createPathRegExp("^" + path + "/.*/index.html");
            return this.getCollection("html")
                       .findAllLive({ relativeOutPath: re }, comparator);            
        },
        getDoc: function(query) {
            return this.getCollection("html").findOne(query).toJSON();
        }
    };
    
    var docpadConfig = { 
        templateData: {
            site: {
                url: "http://lefkadika.gr",
                title: "Εταιρεία Λευκαδικών Μελετών",
                // ToDo:
                description: "H Εταιρεία Λευκαδικών Μελετών είναι το μοναδικό επιστημονικό σωματείο της Λευκάδας",
                // ToDo:
                keywords: "λευκάδα, λευκαδικά, επιστημονική εταιρεία, επιστημονικό σωματείο, lefkas, history, ιστορία, λαογραφία, φιλολογία, αρχαιολογία, φολκλόρ, τοπική ιστορία, επτανησιακή ιστορία",
                styles: ['/vendor/pure-min.css',
                         '/styles/style.css'                         
                         ],
                scripts: ['/vendor/log.js', 
                          '/vendor/modernizr.js',
                          '/vendor/ui.js',
                          '/vendor/hyphenate.js'
                         ]                
            },
            require: require,
            getPreparedTitle: function() {
                if (this.document.title) {
                  return eco.render(this.document.title, docpadConfig.templateData);
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
            console: console,
            trace: {
                pageFlag: false,  
                menuFlag: false,
                page: function(msg) {
                    if (this.pageFlag) {
                        console.log(msg);
                    }
                },
                menu: function(msg) {
                    if (this.menuFlag) {
                        console.log(msg);
                    }
                }
            },
            writeToFile: writeToFile,
            appendToFile: appendToFile,
            imagesRoot: "/images/",
            getImage: function(page) {
                var imagePath;
                if (!page) {
                    imagePath = this.imagesRoot + "not_available.jpg";
                }
                else if (!page.image) {
                    imagePath = this.imagesRoot + page.relativeBase + ".jpg";
                }
                else {
                   imagePath = page.image;
                }
                                                
                return imagePath;
            },
            getThumb: function(page) {
                var imagePath;
                if (!page) {
                    imagePath = this.imagesRoot + "not_available.jpg";
                }
                else if (!page.thumbnail) {
                    imagePath = this.imagesRoot + page.relativeBase + "-th.jpg";
                }
                else {
                    imagePath = page.thumbnail;
                }
                                                
                return imagePath;
            },
            getPublicationGroups: function() {
                var pubs = this.getCollection("publications").toJSON();
                if (!pubs) { console.log("pubs is undefined"); }
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
            },
            getIndexHtmlFrom: helpers.getIndexHtmlFrom,
            getDoc: function(query) {
                var doc;
                try {
                    doc = helpers.getDoc.call(this, query);
                    //writeToFile("file", getObjMembers(doc));
                }
                catch(e) {
                    console.error("Could not find document with query: " + asJSON(query));
                }
                    
                return doc;
            },
            createPathRegExp: createPathRegExp,
            getLogo: function() {
                if (this.getDocument().toJSON().relativeOutPath !== "index.html") {
                    return "/images/logo_light_small.png";
                }
                else {
                    return "/images/logo_light.png";
                }
            },
            getCurrentYear: function() {
                return new Date().getFullYear();
            },
            getYears: function() {
                return this.getCurrentYear() - 1970;
            },
            getPublicationCount: function() {
                // Note that there are 3 multitome books.
                return this.getCollection("publications").length - 3;
            },
            getSymposiumCount: function() {
                return 20;
            },
            getConferenceCount: function() {
                return 4 + 1;
            },
            getMajorEvents: function() {
                return this.getConferenceCount() + this.getSymposiumCount();
            },
            yearComparator: function(a, b) {
                var aS = a.getMeta("year").toString().substr(0, 4);
                var bS = b.getMeta("year").toString().substr(0, 4);
                return parseInt(aS) - parseInt(bS);
            },
            getBoardPeriods: function() {
                var boardPeriods = _.chain(this.getCollection("boards").toJSON())
                                    .groupBy("period")
                                    .map(function(p) {                                        
                                        p = _.sortBy(p, "from");     

                                        return { period: _.first(p).period,
                                                 from: _.first(p).from,
                                                 until: _.last(p).until };
                                    })
                                    .sortBy("from")
                                    .value();                
                return boardPeriods;
            },
            getBoards: function() {
              var boards = this.getCollection("boards");
                           
                _.chain(boards.groupBy("period")).each(function(p) {
                    _.chain(p)
                     .sortBy(function(b) { return b.getMeta("from"); })
                     .each(function(b, i) {
                        b.setMeta("periodNumber", i + 1);
                    });
                });
                
                return boards;  
            },
            getTimelineActivities: function() {
                return this.getCollection("activities")
                           .findAll({ activity: { $in: ["Διαλέξεις", 
                                                        "Εκδηλώσεις", 
                                                        "Συμπόσια", 
                                                        "Συνέδρια", 
                                                        "Παρουσίαση βιβλίων",
                                                        "Βραβεία Ακαδημίας Αθηνών"] } });
            },
            getTimelineYears: function() {
                var timelineYears = this.getTimelineActivities()                                                            .pluck("year");
                
                var publicationYears = _.chain(this.getCollection("publications").toJSON())
                            .map(function(p) {
                                return _.pluck(p.editions, "date");
                            })
                            .flatten()
                            .value();
                
                return _.chain(timelineYears)
                        .union(publicationYears)
                        .sort()
                        .uniq(false)
                        .value();
            },
            getTimelineActivitiesPerType: function() {
                return _.groupBy(this.getTimelineActivities().toJSON(), 'activity');
            },
            getYearPublications: function(year) {
                return _.chain(this.getCollection("publications").toJSON())
                        .filter(function(p) {
                            return _.contains(_.pluck(p.editions, "date"), year);
                        })
                        .value();
            },
            getEventsBySubject: function() {
                return _.chain(this.getCollection("activities")
                                    .findAll({ activity: /^Εκδηλώσεις/})
                                    .toJSON())
                        .groupBy('subject')
                        .sortBy(function(g) {
                            return _.min(_.pluck(g, 'year'));
                        })
                        .value();
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
                               
                               //appendToFile("docs", asJSON(model));
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
                    var isPub = createPathRegExp("^publications/.").test(m.relativeOutDirPath);
                    var isIndexHtml = m.basename === "index"; 
                    return isPub && !isIndexHtml;
                };
                                
                return this.getCollection("html")
                           .createLiveChildCollection()
                           .setFilter("no_index_html", noIndexHtml)
                           .setComparator([{ date: -1 }, { orderIndex: -1 }, { title: 1 }])
                           .on("add", function (model) {
                                model.setMeta("layout", "publication");
                                var editions = model.getMeta("editions");  
                                if (editions) {
                                    var currentEdition = _.first(editions);
                                    _.each(editions, function(e) {
                                        if (e.number > currentEdition.number) {
                                            currentEdition = e;
                                        }
                                    });
                    
                                    model.setMeta("currentEdition", currentEdition);
                                    model.setMeta("date", currentEdition.date);
                                }                    
                            });
            },
            publicationCategories: function() {                
                return helpers.getIndexHtmlFrom.call(this, "publications", [{ menuOrder: 1 }]); 
            },
            boards: function () {
                return this.getCollection("html")
                           .findAllLive({ relativeOutDirPath: /boards/,
                                          basename: { $ne: 'index' } }, [{ date: -1 }])
                           .on("add", function (model) {
                                var period = model.getMeta("period");
                                var from = model.getMeta("from");
                                var until = model.getMeta("until");                             
                                var title = "Περίοδος " + period + " (" + from + "-" + until + ")";
                                model.setMeta("title", title);
                                model.setMeta("menuHidden", false );
                                model.setMeta("layout", "board");                                
                            });
            },
            chronicle: function() {             
                return helpers.getIndexHtmlFrom.call(this, "xroniko")
                            .on("add", function (model) {
                                // If there is not menuTitle, add one based
                                // on the title.
                                var menuTitle = model.getMeta("menuTitle");
                                if (!menuTitle) {
                                    model.setMeta("menuTitle", model.getMeta("title"));
                                }
                                
                                this.sortBy("menuTitle")
                                    .forEach(function(element, index) {
                                    // Added the menu order now that the collection is sorted on
                                    // menuTitle. Index is zero based.
                                    element.setMeta("menuOrder", index + 1);
                                });
                            });                                                            
            },
            activities: function() {
                return this.getCollection("html")
                           .findAllLive({ activity: { $exists: true } });    
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
                    var _ref = req.headers.host;
                    if (_ref && __indexOf.call(oldUrls, _ref) >= 0) {
                        return res.redirect(newUrl + req.url, 301);
                    } else {
                        return next();
                    }
                });
            },
            render: function(opts) {
                //console.log("Custom render of: " + opts.file.toJSON().fullPath);
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
