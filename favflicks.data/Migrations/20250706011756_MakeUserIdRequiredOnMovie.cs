using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace favflicks.data.Migrations
{
    /// <inheritdoc />
    public partial class MakeUserIdRequiredOnMovie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "00000000-0000-0000-0000-000000000000", 0, "d6d46100-c82d-47d3-9b18-b132ec7ae895", "defaultuser@example.com", true, false, null, "DEFAULTUSER@EXAMPLE.COM", "TESTUSER", null, null, false, "e266076b-e890-45ac-89ea-2fa772f5290d", false, "testuser" });
        }
    }
}
