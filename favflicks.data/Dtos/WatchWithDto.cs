namespace favflicks.data.Dtos
{
    public class WatchWithDto
    {
        public int Id { get; set; }
        
        public string InitiatorUserId { get; set; }
        public string InitiatorUsername { get; set; }
        
        public string TargetUserId { get; set; }
        public string TargetUsername { get; set; }

        public int MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string MovieImagePath { get; set; }
        public int MovieYear { get; set; }
        public string MovieGenre { get; set; }

        public DateTime AddedDate { get; set; }
        public int Status { get; set; }
    }

    public class CreateWatchWithDto
    {
        public string TargetUserId { get; set; }
        public int MovieId { get; set; }
    }

    public class UpdateWatchWithStatusDto
    {
        public int Status { get; set; }
    }
}
