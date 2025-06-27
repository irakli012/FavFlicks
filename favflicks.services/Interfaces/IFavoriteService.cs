using favflicks.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(string userId);
        Task AddAsync (Favorite favorite);
        Task DeleteAsync (Favorite favorite);
        Task<Favorite?> GetByIdAsync(int id);
    }
}
