using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        private readonly ITokenService _tokenService;

        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService,IMapper mapper)
         {
           _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }
       
       [HttpPost("register")]  //api/register
       public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
       {
        if (await UserExist(registerDto.Username)) return BadRequest("UserName is taken");

       var user = _mapper.Map<AppUser>(registerDto);
        
         user.UserName = registerDto.Username.ToLower();
      
        var result = await _userManager.CreateAsync(user,registerDto.Password);

        if(!result.Succeeded) return BadRequest(result.Errors);

        var roleResult = await _userManager.AddToRoleAsync(user,"Member");

        if(!roleResult.Succeeded) return BadRequest(result.Errors);
// return user;
        return new UserDto
         {
            UserName = user.UserName,
            Token =await _tokenService.CreateToken(user),
            KnownAs =user.KnownAs,
            Gender = user.Gender
         };
       }

       [HttpPost("login")]
       public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
       {
        var user = await _userManager.Users
        .Include(p =>p.Photos)
        .SingleOrDefaultAsync(x =>x.UserName ==loginDto.UserName);

        if(user ==null) return Unauthorized("Invalid UserName");

        var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);

        if(!result) return Unauthorized("Invalid password");

         return new UserDto
         {
            UserName = user.UserName,
            Token =await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x =>x.IsMain)?.Url,
            Gender = user.Gender,
            KnownAs = user.KnownAs
         };
         
       }


       private async Task<bool> UserExist(string username)
       {
        return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
       }
    }
}