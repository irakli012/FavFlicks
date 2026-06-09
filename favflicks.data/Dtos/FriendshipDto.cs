using favflicks.data.Enums;

namespace favflicks.data.Dtos
{
    public class FriendshipDto
    {
        public int Id { get; set; }
        public string RequesterId { get; set; }
        public string RequesterUsername { get; set; }
        public string AddresseeId { get; set; }
        public string AddresseeUsername { get; set; }
        public FriendshipStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
