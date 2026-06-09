using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchWithFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WatchWiths",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InitiatorUserId = table.Column<string>(type: "text", nullable: false),
                    TargetUserId = table.Column<string>(type: "text", nullable: false),
                    MovieId = table.Column<int>(type: "integer", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchWiths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WatchWiths_AspNetUsers_InitiatorUserId",
                        column: x => x.InitiatorUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WatchWiths_AspNetUsers_TargetUserId",
                        column: x => x.TargetUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WatchWiths_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WatchWiths_InitiatorUserId",
                table: "WatchWiths",
                column: "InitiatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchWiths_MovieId",
                table: "WatchWiths",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchWiths_TargetUserId",
                table: "WatchWiths",
                column: "TargetUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WatchWiths");
        }
    }
}
