import mongoose, { connect } from "mongoose";
import prompt from "prompt-sync";

try {
  const con = await connect("mongodb://127.0.0.1:27017/moviecollection");
  if (con) {
    console.log("Connected to MongoDB");
    const movieSchema = new mongoose.Schema({
      title: { type: String },
      director: { type: String },
      releaseYear: { type: Number },
      genres: [String],
      ratings: [Number],
      cast: [String],
    });

    const Movie = mongoose.model("Movies", movieSchema);

    async function Menu() {
      let p = prompt();
      let runApp = true;

      while (runApp) {

        console.log("");
        console.log("*~ MENU ~*");
        console.log("");
        console.log("1. View all movies");
        console.log("2. Add a new movie");
        console.log(
          "3. Update a movie"
        );
        console.log("4. Delete a movie");
        console.log("5. Exit");

          console.log("")
        let input = p("Please make a choice by entering a number: ");

        switch (input) {
          case "1":
            const movies = await Movie.find({});
            movies.forEach((movie, i) => {
              console.log(`${i + 1}. ${movie.title}`);
            });
            break;

          case "2":
            try {
              let inputTitle = p("Enter movie title: ");
              let inputDirector = p("Name director: ");
              let inputReleaseYear = parseInt(p("Insert release year (numbers only): "));
              let inputGenres = p(
                "Enter genre(s), separated by commas: "
              ).split(",");
              let inputRatings = p("Add rating(s), separated by commas (numbers only): ")
                .split(",")
                .map(parseFloat);
              let inputCast = p("Enter cast: ").split(",");

              await Movie.create({
                title: inputTitle,
                director: inputDirector,
                releaseYear: inputReleaseYear,
                genres: inputGenres,
                ratings: inputRatings,
                cast: inputCast,
              });

              console.log("")
              console.log(`${inputTitle} has been added successfully!`);
              break;

            } catch(error){
              /* console.log(error) */
               console.log(
                  "Encountered an error while trying to add a new film, remember to fill every field"
                );
                console.log(
                  "If you do not have the information, you can state it as 'unknown'"
                );
                console.log("Redirecting you to the main menu");
                break;
              }
              
            
          

          case "3":
            try {
              const movieUpdateList = await Movie.find({});
              movieUpdateList.forEach((movie, i) => {
                console.log(`${i + 1}. ${movie.title}`);
              });

              console.log("")
              let movieToUpdate = p(
                "Please enter which movie you want to edit by inserting it's index number in the list: "
              );

              if (
                movieToUpdate >= 1 &&
                movieToUpdate <= movieUpdateList.length
              ) {
                let selectedMovie = movieUpdateList[movieToUpdate - 1];

                console.log(`So you want to update ${selectedMovie.title}`);
                console.log("")
                console.log("1. Update title");
                console.log("2. Update director name");
                console.log("3. Update release year");
                console.log("4. Update genre");
                console.log("5. Update ratings");
                console.log("6. Update cast");
                console.log("7. Cancel update");
                console.log("")

                let movieUpdateMenu = p(
                  "Please enter your choice by entering a number: "
                );

                switch (movieUpdateMenu) {
                  case "1":
                    let updatedTitle = p("Enter new movie title: ");
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { title: updatedTitle } }
                    );
                    console.log(
                      `Successfully edited movie name to ${updatedTitle}`
                    );
                    break;

                  case "2":
                    let updatedDirector = p("Enter new director name: ");
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { director: updatedDirector } }
                    );
                    console.log(
                      `Successfully updated director name to ${updatedDirector}`
                    );
                    break;

                  case "3":
                    let updatedReleaseYear = p("Enter new release year (numbers only): ");
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { releaseYear: updatedReleaseYear } }
                    );
                    console.log(
                      `Successfully edited release year to ${updatedReleaseYear}`
                    );
                    break;

                  case "4":
                    let updatedGenres = p("Enter new genre(s), separated by a comma: ");
                    updatedGenres = updatedGenres.split(",").map((genre) => genre.trim());
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { genres: updatedGenres } }
                    );
                    console.log(
                      `Successfully edited genre(s)`
                    );
                    break;

                  case "5":
                    let updatedRatings = p("Enter new rating(s), separated by a comma (numbers only): ");
                    updatedRatings = updatedRatings.split(",").map(parseFloat);
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { ratings: updatedRatings } }
                    );
                    console.log(
                      `Successfully edited rating(s)`
                    );
                    break;

                  case "6":
                    let updatedCast = p("Enter new cast, separated by a comma: ");
                    updatedCast = updatedCast.split(",").map((actor) => actor.trim());
                    await Movie.updateOne(
                      { _id: selectedMovie._id },
                      { $set: { cast: updatedCast } }
                    );
                    console.log(
                      `Successfully edited cast`
                    );
                    break;

                  case "7":
                    console.log("");
                    console.log(
                      "Cancelling update, returning you to the main menu"
                    );
                    console.log("");
                    break;

                  default:
                    console.log("");
                    console.log("Invalid choice, returning you to main menu");
                    break;
                }
              } else {
                console.log("");
                console.log("Invalid index, movie not found. Returning you to main menu");
                
              
              };

            } catch (error) {
              console.log("Update movie failed, returning you to main menu")
              
            }
            break;

          case "4":
          try {
            const movieList = await Movie.find({});
            movieList.forEach((movies, i) => {
              console.log(`${i + 1}. ${movies.title}`)
            })

            console.log("")

            let deleteMovie = p("Choose a movie to delete by inserting index number: ")

            if (
                deleteMovie >= 1 &&
                deleteMovie <= movieList.length
              ) { const selectedMovie = movieList[deleteMovie - 1];
                
                console.log("")
                console.log(`You are about to delete ${selectedMovie.title}`)
                let confirmDeletetion = p(
                  `Are you sure you want to delete ${selectedMovie.title}? (yes/no): `
                );

                if (confirmDeletetion.toLowerCase() == "yes") {
                  await Movie.deleteOne({_id: selectedMovie._id});
                  console.log(`${selectedMovie.title} has successfully been deleted, returning you to main menu`)
                  break;
                } else {
                  console.log("Deletion cancelled, returning you to main menu");
                  break;
                }

                
              } else {
                console.log("Invalid choice, returning you to main menu");
                break;
              }

          }catch (error) {
            console.log("Error encountered while trying to delete movie", error)
          }

          case "5":
            runApp = false;
            break;

          default:
            console.log("")
            console.log("No option for your input is available.");
              console.log("Please insert a number between 1-5"); 
            console.log("")
            break;
        }
        

      }
      
    }
    Menu();
  }
} catch (error) {
  console.log("Can't fetch movies: ", error);
}

