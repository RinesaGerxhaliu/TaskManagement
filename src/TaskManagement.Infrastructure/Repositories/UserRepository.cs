using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories;

public class SQLUserRepository : IUserRepository
{
    private readonly TaskManagementDbContext dbcontext;

    public SQLUserRepository(TaskManagementDbContext dbcontext)
    {
        this.dbcontext = dbcontext;
    }

    public async Task<User> CreateAsync(User user)
    {
        await dbcontext.User.AddAsync(user);
        await dbcontext.SaveChangesAsync();
        return user;
    }

    public async Task<User?> DeleteAsync(string id)
    {
        var existingUser = await dbcontext.User.FirstOrDefaultAsync(x => x.Id == id);

        if (existingUser == null)
        {
            return null;
        }

        dbcontext.User.Remove(existingUser);
        await dbcontext.SaveChangesAsync();

        return existingUser; // Return the deleted user
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await dbcontext.User
          .ToListAsync();
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await dbcontext.User
           .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> UpdateAsync(string id, User user)
    {
        var existingUser = await dbcontext.User.FirstOrDefaultAsync(x => x.Id == id);

        if (existingUser == null)
        {
            return null;
        }

        existingUser.emri = user.emri;
        existingUser.mbiemri = user.mbiemri;
        existingUser.Adresa = user.Adresa;
        existingUser.gjinia = user.gjinia;
        existingUser.dataELindjes = user.dataELindjes;
        existingUser.numriTelefonit = user.numriTelefonit;

        await dbcontext.SaveChangesAsync();
        return existingUser;
    }
}
