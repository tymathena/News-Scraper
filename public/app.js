const addArticle = article => {
  return `<div class="link-holder"><a href="${article.link}">${article.title}</a>
            <button class="btn btn-primary btn-lg add-note" id="add-note" data-toggle="modal" data-target="#add-note-modal" data-id="${article._id}">Add note</button>
            <button class="btn btn-primary btn-lg save-article" data-id="${article._id}">Save Article</button>
          </div>`
}

// Grab the articles as a json
const getStartingArticles = () => {
  $.getJSON("api/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(addArticle(data[i]))
    }
  });
}

const getSavedArticles = () => {
  $.getJSON("api/saved", data => {
    console.log("Saved: ", data)

    $("#articles").html("");

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(addArticle(data[i]))
    }
  });
}

$(document).on("click", "#view-saved", function () {

  console.log("Greetingd")

  getSavedArticles();
});

$(document).on("click", "#add-note", function () {

  const id = ($(this).attr("data-id"))

  $("#add-note-modal").toggle()

  $("#add-note-modal").attr("data-id", id)

  $.ajax({
    method: "GET",
    url: "/api/articles/" + id
  }).then(data => {
    $("#note").text(data.note)
  }).catch(err => {
    console.log(err);
  })
  /*
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "api/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
    */
});

// When you click the savenote button
$(document).on("click", "#save-note", function () {

  const id = ($("#add-note-modal").attr("data-id"))

  $.ajax({
    method: "POST",
    url: "/api/articles/addNote/" + id,
    data: {
      note: $("#note").text()
    }
  }).then(data => {
    $("#note").text("")
    $("#add-note-modal").toggle()
  }).catch(err => {
    console.log(err)
  })



  /*
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  */
});

$(document).on("click", ".close-modal", function () {

  $("#add-note-modal").toggle()

});

$(document).on("click", ".save-article", function () {

  const id = ($(this).attr("data-id"))

  $.ajax({
    method: "GET",
    url: "/api/articles/" + id
  }).then(function (data) {
    console.log(data)
    return $.ajax({
      method: "POST",
      url: "/api/saved",
      data
    })
  }).then(function (data) {

  }).catch(err => {
    console.log(err)
  })

});

getStartingArticles();