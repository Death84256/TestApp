using System;
using System.Collections.Generic;

namespace Esebial.Codebase.Data.Models;

public partial class User
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedTime { get; set; }

    public string UpdatedBy { get; set; } = null!;

    public DateTime UpdatedTime { get; set; }

    public bool Deleted { get; set; }
}
