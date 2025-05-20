namespace TaskManagement.Domain.Entities
{
    public class Priority
    {
        public int Id { get; set; }
        public string Level { get; set; } = null!;
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }

}
