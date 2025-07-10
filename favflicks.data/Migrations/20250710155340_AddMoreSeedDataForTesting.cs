using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreSeedDataForTesting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Movies",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.InsertData(
                table: "Movies",
                columns: new[] { "Id", "Description", "ImagePath", "Name", "UserId" },
                values: new object[,]
                {
                    { 4, "A hacker learns about the true nature of his reality.", "/images/movies/matrix.jpg", "The Matrix", "00000000-0000-0000-0000-000000000000" },
                    { 5, "A team travels through a wormhole in space to ensure humanity's survival.", "/images/movies/interstellar.jpg", "Interstellar", "00000000-0000-0000-0000-000000000000" },
                    { 6, "The lives of criminals intertwine in this nonlinear story.", "/images/movies/pulpfiction.jpg", "Pulp Fiction", "00000000-0000-0000-0000-000000000000" },
                    { 7, "Batman faces his greatest challenge in the form of the Joker.", "/images/movies/darkknight.jpg", "The Dark Knight", "00000000-0000-0000-0000-000000000000" },
                    { 8, "A man's simple outlook leads him through incredible life events.", "/images/movies/forrestgump.jpg", "Forrest Gump", "00000000-0000-0000-0000-000000000000" },
                    { 9, "Earth's mightiest heroes must unite to save the world.", "/images/movies/avengers.jpg", "The Avengers", "00000000-0000-0000-0000-000000000000" },
                    { 10, "A romance unfolds aboard the ill-fated RMS Titanic.", "/images/movies/titanic.jpg", "Titanic", "00000000-0000-0000-0000-000000000000" },
                    { 11, "A betrayed Roman general seeks revenge.", "/images/movies/gladiator.jpg", "Gladiator", "00000000-0000-0000-0000-000000000000" },
                    { 12, "Toys come to life when humans aren't around.", "/images/movies/toystory.jpg", "Toy Story", "00000000-0000-0000-0000-000000000000" },
                    { 13, "A theme park suffers a major security breakdown with dinosaurs.", "/images/movies/jurassicpark.jpg", "Jurassic Park", "00000000-0000-0000-0000-000000000000" },
                    { 14, "Two imprisoned men bond over the years.", "/images/movies/shawshank.jpg", "The Shawshank Redemption", "00000000-0000-0000-0000-000000000000" },
                    { 15, "A lion cub's journey to reclaim his kingdom.", "/images/movies/lionking.jpg", "The Lion King", "00000000-0000-0000-0000-000000000000" },
                    { 16, "A teenager travels back in time to help his parents.", "/images/movies/backtothefuture.jpg", "Back to the Future", "00000000-0000-0000-0000-000000000000" },
                    { 17, "The story of Facebook's founding.", "/images/movies/socialnetwork.jpg", "The Social Network", "00000000-0000-0000-0000-000000000000" },
                    { 18, "An office worker forms an underground fight club.", "/images/movies/fightclub.jpg", "Fight Club", "00000000-0000-0000-0000-000000000000" },
                    { 19, "A boy journeys to the Land of the Dead to uncover family secrets.", "/images/movies/coco.jpg", "Coco", "00000000-0000-0000-0000-000000000000" },
                    { 20, "A jazz musician and an aspiring actress fall in love.", "/images/movies/lalaland.jpg", "La La Land", "00000000-0000-0000-0000-000000000000" }
                });

            migrationBuilder.InsertData(
                table: "MovieTag",
                columns: new[] { "MoviesId", "TagsId" },
                values: new object[,]
                {
                    { 4, 1 },
                    { 4, 4 },
                    { 5, 3 },
                    { 5, 4 },
                    { 6, 3 },
                    { 7, 1 },
                    { 7, 3 },
                    { 8, 3 },
                    { 9, 1 },
                    { 9, 4 },
                    { 10, 3 },
                    { 11, 1 },
                    { 11, 3 },
                    { 12, 2 },
                    { 12, 4 },
                    { 13, 1 },
                    { 13, 4 },
                    { 14, 3 },
                    { 15, 1 },
                    { 15, 3 },
                    { 16, 2 },
                    { 16, 4 },
                    { 17, 3 },
                    { 18, 3 },
                    { 19, 2 },
                    { 19, 3 },
                    { 20, 2 },
                    { 20, 3 }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies");

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 4, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 4, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 5, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 5, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 6, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 7, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 7, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 8, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 9, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 9, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 10, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 11, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 11, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 12, 2 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 12, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 13, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 13, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 14, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 15, 1 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 15, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 16, 2 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 16, 4 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 17, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 18, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 19, 2 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 19, 3 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 20, 2 });

            migrationBuilder.DeleteData(
                table: "MovieTag",
                keyColumns: new[] { "MoviesId", "TagsId" },
                keyValues: new object[] { 20, 3 });

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Movies",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
