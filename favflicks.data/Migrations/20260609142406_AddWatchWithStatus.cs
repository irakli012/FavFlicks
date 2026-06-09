using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchWithStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "WatchWiths",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "WatchWiths");
        }
    }
}
