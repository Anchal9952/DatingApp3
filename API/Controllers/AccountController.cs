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

namespace API.Controllers
{     
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
         {
            this._context = context;
            this._tokenService = tokenService;
        }
       
       [HttpPost("register")]  //api/register
       public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
       {
        var sd = await UserExist(registerDto.Username);
        if (await UserExist(registerDto.Username)) return BadRequest("UserName is taken");
         using var hmac = new HMACSHA512();
        
        var user = new AppUser
        {
            UserName = registerDto.Username,
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

// return user;
        return new UserDto
         {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user)
         };
       }

       [HttpPost("login")]
       public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
       {
        var user = await _context.Users.SingleOrDefaultAsync(x =>
        x.UserName ==loginDto.UserName);

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
            Token = _tokenService.CreateToken(user)
         };
         
       }


       private async Task<bool> UserExist(string username)
       {
        return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
       }
    }
}