using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interface
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUserAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserBynameAsync(string username);

        Task<PagedList<MemberDto>> GetMemberAsync(UserParams userParams);

        Task<MemberDto> GetMemberAsync(string username);

        Task<string> GetUserGender(string username);
    }
}