using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchLaterAndAddFetchMoviesNewPropertiesToMovies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieTag_Movies_MoviesId",
                table: "MovieTag");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieTag_Tags_TagsId",
                table: "MovieTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieTag",
                table: "MovieTag");

            migrationBuilder.RenameTable(
                name: "MovieTag",
                newName: "MovieTags");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Movies",
                newName: "AddedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Movies_UserId",
                table: "Movies",
                newName: "IX_Movies_AddedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_MovieTag_TagsId",
                table: "MovieTags",
                newName: "IX_MovieTags_TagsId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Movies",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Movies",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "BackdropPath",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountryOfOrigin",
                table: "Movies",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "Movies",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Director",
                table: "Movies",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Movies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExternalUrl",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Genre",
                table: "Movies",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImdbUrl",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Movies",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductionCompany",
                table: "Movies",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReleaseDate",
                table: "Movies",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RuntimeMinutes",
                table: "Movies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Movies",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Stars",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Writers",
                table: "Movies",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YouTubeTrailerId",
                table: "Movies",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieTags",
                table: "MovieTags",
                columns: new[] { "MoviesId", "TagsId" });

            migrationBuilder.CreateTable(
                name: "WatchList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WatchList_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WatchList_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.Sql(@"
    IF NOT EXISTS (SELECT 1 FROM [AspNetUsers] WHERE [Id] = '00000000-0000-0000-0000-000000000000')
    BEGIN
        INSERT INTO [AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName])
        VALUES (N'00000000-0000-0000-0000-000000000000', 0, N'85c9684a-cb17-4a0a-96d6-2180592ea7d4', N'defaultuser@example.com', CAST(1 AS bit), CAST(0 AS bit), NULL, N'DEFAULTUSER@EXAMPLE.COM', N'TESTUSER', NULL, NULL, CAST(0 AS bit), N'95f77958-62f1-403a-ac3b-28ac7324de5d', CAST(0 AS bit), N'testuser')
    END
");

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3191), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3195), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3197), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3199), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3201), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3269), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3271), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3273), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3275), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3277), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3279), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3280), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3282), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3284), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3286), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3288), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3289), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3291), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3293), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.UpdateData(
                table: "Movies",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "BackdropPath", "CountryOfOrigin", "DateAdded", "Director", "ExternalId", "ExternalUrl", "Genre", "ImdbUrl", "Language", "ProductionCompany", "ReleaseDate", "RuntimeMinutes", "Source", "Stars", "Writers", "YouTubeTrailerId" },
                values: new object[] { null, null, new DateTime(2025, 8, 2, 15, 37, 20, 514, DateTimeKind.Utc).AddTicks(3295), null, null, null, null, null, null, null, null, null, "UserImport", null, null, null });

            migrationBuilder.CreateIndex(
                name: "IX_WatchList_MovieId",
                table: "WatchList",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchList_UserId",
                table: "WatchList",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_AspNetUsers_AddedByUserId",
                table: "Movies",
                column: "AddedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieTags_Movies_MoviesId",
                table: "MovieTags",
                column: "MoviesId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieTags_Tags_TagsId",
                table: "MovieTags",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_AspNetUsers_AddedByUserId",
                table: "Movies");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieTags_Movies_MoviesId",
                table: "MovieTags");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieTags_Tags_TagsId",
                table: "MovieTags");

            migrationBuilder.DropTable(
                name: "WatchList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieTags",
                table: "MovieTags");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "00000000-0000-0000-0000-000000000000");

            migrationBuilder.DropColumn(
                name: "BackdropPath",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "CountryOfOrigin",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Director",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ExternalUrl",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Genre",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ImdbUrl",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ProductionCompany",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "RuntimeMinutes",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Stars",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Writers",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "YouTubeTrailerId",
                table: "Movies");

            migrationBuilder.RenameTable(
                name: "MovieTags",
                newName: "MovieTag");

            migrationBuilder.RenameColumn(
                name: "AddedByUserId",
                table: "Movies",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Movies_AddedByUserId",
                table: "Movies",
                newName: "IX_Movies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MovieTags_TagsId",
                table: "MovieTag",
                newName: "IX_MovieTag_TagsId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieTag",
                table: "MovieTag",
                columns: new[] { "MoviesId", "TagsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_AspNetUsers_UserId",
                table: "Movies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieTag_Movies_MoviesId",
                table: "MovieTag",
                column: "MoviesId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieTag_Tags_TagsId",
                table: "MovieTag",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
