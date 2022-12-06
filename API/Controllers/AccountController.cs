using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using System.Text;
using API.Interface;
using AutoMapper;

namespace API.Controllers
{     
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;

        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService,IMapper mapper)
         {
            this._context = context;
            this._tokenService = tokenService;
            _mapper = mapper;
        }
       
       [HttpPost("register")]  //api/register
       public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
       {
        var sd = await UserExist(registerDto.Username);
        if (await UserExist(registerDto.Username)) return BadRequest("UserName is taken");

       var user = _mapper.Map<AppUser>(registerDto);

         using var hmac = new HMACSHA512();
        
         user.UserName = registerDto.Username;
            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
      

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

// return user;
        return new UserDto
         {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user),
            KnownAs =user.KnownAs
         };
       }

       [HttpPost("login")]
       public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
       {
        var user = await _context.Users
        .Include(p =>p.Photos)
        .SingleOrDefaultAsync(x =>x.UserName ==loginDto.UserName);

        if(user ==null) return Unauthorized("Invalid UserName");

         using var hmac = new HMACSHA512(user.PasswordSalt);

         var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

         for(int i=0; i< computedhash.Length;i++)
         {
            if(computedhash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
         }

        //  return user;
         return new UserDto
         {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x =>x.IsMain).Url,
            KnownAs = user.KnownAs
         };
         
       }


       private async Task<bool> UserExist(string username)
       {
        return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
       }
    }
}