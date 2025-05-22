using System.Xml.Linq;

namespace TaskManagement.Domain.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = "ToDo";

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();

        public string UserId { get; set; }
        public User User { get; set; }
    }

}
