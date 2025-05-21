using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly ITokenService tokenService;

        public AuthController(UserManager<User> userManager, ITokenService tokenService)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            if (registerRequestDTO == null)
            {
                return BadRequest("Request body is null.");
            }

            var identityUser = new User
            {
                UserName = registerRequestDTO.Username,
                Email = registerRequestDTO.Username
            };

            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDTO.Password);

            if (!identityResult.Succeeded)
            {
                var errors = string.Join(", ", identityResult.Errors.Select(e => e.Description));
                return BadRequest($"User creation failed: {errors}");
            }

            // Add roles to this User
            if (registerRequestDTO.Roles != null && registerRequestDTO.Roles.Any())
            {
                identityResult = await userManager.AddToRolesAsync(identityUser, registerRequestDTO.Roles);

                if (!identityResult.Succeeded)
                {
                    var errors = string.Join(", ", identityResult.Errors.Select(e => e.Description));
                    return BadRequest($"Adding roles failed: {errors}");
                }
            }

            return Ok("User was registered!");
        }

        /*[HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            var identityUser = new User
            {
                UserName = registerRequestDTO.Username,
                Email = registerRequestDTO.Username
            };
            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDTO.Password);

            if (identityResult.Succeeded)
            {
                //Add roles to this User
                if (registerRequestDTO.Roles != null && registerRequestDTO.Roles.Any())
                {
                    identityResult = await userManager.AddToRolesAsync(identityUser, registerRequestDTO.Roles);

                    if (identityResult.Succeeded)
                    {
                        return Ok("User was registered!");
                    }
                }
            }

            return BadRequest("Something went wrong!");
        }*/


        [HttpPost]
        [Route("Login")]

        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var user = await userManager.FindByEmailAsync(loginRequestDTO.Username);

            if (user != null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, loginRequestDTO.Password);

                if (checkPasswordResult)
                {
                    //Getting roles for this user
                    var roles = await userManager.GetRolesAsync(user);

                    if (roles != null)
                    {
                        //Creating and returning the token
                        var jwtToken = tokenService.CreateJWTToken(user, roles.ToList());

                        var response = new LoginResponseDTO
                        {
                            JwtToken = jwtToken
                        };
                        return Ok(response);
                    }
                }
            }
            return BadRequest("Something went wrong!");
        }
    }
}
