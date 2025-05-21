using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.Entities;
public class User : IdentityUser
{
//public string Id { get; set; }
public string? emri { get; set; }

public string? mbiemri { get; set; }

public string? Adresa { get; set; }

public string? gjinia { get; set; }

public DateTime? dataELindjes { get; set; }

public string? numriTelefonit { get; set; }

}