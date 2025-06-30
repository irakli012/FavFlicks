using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieRatingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoviesRating_AspNetUsers_UserId",
                table: "MoviesRating");

            migrationBuilder.DropForeignKey(
                name: "FK_MoviesRating_Movies_MovieId",
                table: "MoviesRating");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MoviesRating",
                table: "MoviesRating");

            migrationBuilder.RenameTable(
                name: "MoviesRating",
                newName: "MovieRatings");

            migrationBuilder.RenameIndex(
                name: "IX_MoviesRating_UserId",
                table: "MovieRatings",
                newName: "IX_MovieRatings_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MoviesRating_MovieId",
                table: "MovieRatings",
                newName: "IX_MovieRatings_MovieId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tags",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieRatings",
                table: "MovieRatings",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "00000000-0000-0000-0000-000000000000",
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "d6d46100-c82d-47d3-9b18-b132ec7ae895", "e266076b-e890-45ac-89ea-2fa772f5290d" });

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRatings_AspNetUsers_UserId",
                table: "MovieRatings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRatings_Movies_MovieId",
                table: "MovieRatings",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieRatings_AspNetUsers_UserId",
                table: "MovieRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieRatings_Movies_MovieId",
                table: "MovieRatings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieRatings",
                table: "MovieRatings");

            migrationBuilder.RenameTable(
                name: "MovieRatings",
                newName: "MoviesRating");

            migrationBuilder.RenameIndex(
                name: "IX_MovieRatings_UserId",
                table: "MoviesRating",
                newName: "IX_MoviesRating_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MovieRatings_MovieId",
                table: "MoviesRating",
                newName: "IX_MoviesRating_MovieId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tags",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MoviesRating",
                table: "MoviesRating",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "00000000-0000-0000-0000-000000000000",
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "e2a11bf6-3371-4c41-a9f0-c0f9637d0bfe", "d2781f07-40fe-421c-a3db-731b65f9d31e" });

            migrationBuilder.AddForeignKey(
                name: "FK_MoviesRating_AspNetUsers_UserId",
                table: "MoviesRating",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MoviesRating_Movies_MovieId",
                table: "MoviesRating",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
