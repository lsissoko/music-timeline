$(document).ready(function() {
    "use strict";

    var defaultArtistStr = "kanye west, jay-z, lil wayne, drake";
    var defaultArtistList = defaultArtistStr.split(", ");

    String.prototype.squish = function() {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    };

    function loadPage(terms) {
        if (terms.length > 0) {
            var baseUrl = window.location.href.split("?")[0];
            var queryString = "?" + $.param({
                "terms": terms
            });
            location.assign(baseUrl + queryString);
        }
    }

    function addPageToHistory(terms) {
        var pageObj = {
            "html": window.location.href,
            "pageTitle": ""
        };
        var url = window.location.href.split("?")[0] + "?" + $.param({
            "terms": terms
        });
        window.history.pushState(pageObj, "", url);
    }

    function getQueryString() {
        var qd = new QueryData();
        var terms = [];
        $.each(qd, function(i, item) {
            terms.push(item.squish());
        });
        return terms.join(", ");
    }

    function getSearchTerms() {
        var terms = getQueryString();
        if (terms === "") {
            terms = defaultArtistStr;
            addPageToHistory(terms);
        }
        return terms;
    }

    function metacriticURL(artist) {
        artist = artist.replace(/\s+/g, "-").replace(/'/g, "").replace(/\$/g, "");
        return "http://www.metacritic.com/person/" + artist + "?filter-options=music";
    }

    function search() {
        // Set the default artists
        var artists = defaultArtistList;

        // Replace the default artists with the user-given values
        var inputArtists = $("input[name=search]").val().split(",");
        $.each(inputArtists, function(i, artist) {
            artists[i] = artist.squish().toLowerCase();
        });

        // Get the artist data
        var requests = [];
        var data = [];
        $.each(artists, function(i, artist) {
            requests.push(
                $.ajax({
                    url: metacriticURL(artist),
                    type: "GET",
                    success: function(res) {
                        var albums = [];
                        var credits = $(res.responseText)
                            .find("table.credits.person_credits>tbody")
                            .children();
                        $.each(credits, function(i, tr) {
                            var row = $(tr);
                            albums.push({
                                date: row.find("td.year").text().squish(),
                                name: row.find("a").text(),
                                score: parseInt(row.find("span.metascore_w").text())
                            });
                        });
                        data = data.concat({
                            "artist": artist,
                            "albums": albums
                        });
                    }
                })
            );
        });

        // Draw the graph
        $.when.apply(undefined, requests).then(function(results) {
            $("#timeline").html("");
            draw(data);
        });
    }

    $(":input[name=search]").keyup(function(e) {
        // "ENTER" key
        if (e.keyCode === 13) {
            loadPage($(":input[name=search]").val().squish());
        }
    });

    $("#enter").click(function(e) {
        e.preventDefault();
        loadPage($(":input[name=search]").val().squish());
    });

    ///////////////////////////////////////////////////////////////////////////
    // MAIN
    ///////////////////////////////////////////////////////////////////////////

    // get the search term from the query string
    var searchTerms = getSearchTerms();

    // set the input field's value
    $(":input[name=search]").val(searchTerms);

    // perform the search
    search(searchTerms);
});
