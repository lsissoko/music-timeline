$(document).ready(function() {
    "use strict";

    String.prototype.trim = function() {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    };

    function metacriticURL(artist) {
        artist = artist.replace(/\s+/g, "-").replace(/'/g, "").replace(/\$/g, "");
        return "http://www.metacritic.com/person/" + artist + "?filter-options=music";
    }

    function search() {
        // Set the default artists
        var artists = ["kanye west", "jay-z", "lil wayne", "drake"];

        // Replace default artists with user-given values
        var inputArtists = $("input[name=artists]").val().split(",");
        $.each(inputArtists, function(i, artist) {
            artists[i] = artist.trim().toLowerCase();
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
                                date: row.find("td.year").text().trim(),
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

    $(":input[name=artists]").keyup(function(e) {
        // "ENTER" key
        if (e.keyCode === 13) {
            search();
        }
    });

    $("#enter").click(function(e) {
        e.preventDefault();
        search();
    });

    ///////////////////////////////////////////////////////////////////////////
    // MAIN
    ///////////////////////////////////////////////////////////////////////////

    // Display and search for the default artists
    $("input[name=artists]").val("kanye west, jay-z, lil wayne, drake");
    search();
});
