using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.DTOs.UserDTO;

public class UserDTO
{
    //[MaxLength(50)]
    public string Id { get; set; }
    
    public string emri { get; set; } = "";

    public string mbiemri { get; set; } = "";

    public string? adresa { get; set; } = "";

    public string? gjinia { get; set; } = "";

    public DateTime? dataELindjes { get; set; }

    public string? numriTelefonit { get; set; }
}
