namespace TaskManagement.Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TaskItemId { get; set; }
        public TaskItem TaskItem { get; set; } = null!;
    }

}
