using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Net;
using System.Security.Claims;
using Tp_Programacion.Models.Role;
using Tp_Programacion.Models.User;
using Tp_Programacion.Models.User.Dto;
using Tp_Programacion.Utils;
using Tp_Programacion.Enums;

namespace Tp_Programacion.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> Login(LoginDTO login, HttpContext context);
        Task Logout(HttpContext context);
        Task<UserDTO> Register(RegisterDTO register);
        Task<UserDTO> UpdateRolesToUser(int userId, List<int> roleIds);
        Task GeneratePwdTokenToUser(HttpContext context);
        Task VerifyUserPwdToken(int userId, string token);
        Task<UserDTO> GetAuthenticatedUser(HttpContext context);
    }

    public class AuthService : IAuthService
    {
        private readonly UserService _userService;
        private readonly RoleService _roleService;
        private readonly IEncoderService _encoder;
        private readonly EmailService _emailService;
        private readonly IMapper _mapper;

        public AuthService(UserService userService, IMapper mapper, IConfiguration config, RoleService roleService, IEncoderService encoder, EmailService emailService)
        {
            _userService = userService;
            _mapper = mapper;
            _roleService = roleService;
            _encoder = encoder;
            _emailService = emailService;
        }

        public async Task GeneratePwdTokenToUser(HttpContext context)
        {
            Console.WriteLine(context.Request.Scheme);
            Console.WriteLine(context.Request.Host);
            int userId = GetUserIdFromContext(context);
            string[] data = await _userService.GeneratePwdToken(userId, context.Request);
            await _emailService.SendResetPwdAsync(data[1], data[0]);
        }
        public async Task VerifyUserPwdToken(int userId, string token)
        {
            bool IsCorrect = await _userService.VerifyPwdToken(userId, token);
            if (!IsCorrect)
            {
                throw new ErrorResponse(HttpStatusCode.BadRequest, "Invalid Token");
            }
        }

        public async Task<LoginResponseDTO> Login(LoginDTO login, HttpContext context)
        {
            User? user;
            if (login.UsernameOrEmail.Contains("@"))
            {
                user = await _userService.GetOneByUsernameOrEmail(login.UsernameOrEmail, null);
            }
            else
            {
                user = await _userService.GetOneByUsernameOrEmail(null, login.UsernameOrEmail);
            }

            if (user == null) throw new ErrorResponse(HttpStatusCode.BadRequest, "Invalid Credentials");

            bool verified = _encoder.Verify(user.Password, login.Password);
            if (!verified)
            {
                throw new ErrorResponse(HttpStatusCode.BadRequest, "Invalid Credentials");
            }

            await SetCookie(user, context);

            var loginReponse = new LoginResponseDTO()
            {
                User = _mapper.Map<UserDTO>(user)
            };
            return loginReponse;
        }

        private int GetUserIdFromContext(HttpContext context)
        {
            var user = context.User.Claims.FirstOrDefault(claim => claim.Type == "id");
            int id;
            bool ok = int.TryParse(user?.Value, out id);
            if (!ok) throw new ErrorResponse(HttpStatusCode.BadRequest, "invalid session");
            return id;
        }

        public async Task Logout(HttpContext context)
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public async Task SetCookie(User user, HttpContext context)
        {
            var claims = new List<Claim>()
            {
                new Claim("id", user.Id.ToString())
            };

            if (user.Roles != null || user.Roles?.Count > 0)
            {
                foreach (var role in user.Roles)
                {
                    var roleClaim = new Claim(ClaimTypes.Role, role.Name);
                    claims.Add(roleClaim);
                }
            }

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties()
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(7),
                }
            );
        }

        public async Task<UserDTO> Register(RegisterDTO register)
        {
            User? u = await _userService
                .GetOneByUsernameOrEmail(
                    register.Email,
                    register.UserName
                );
            if (u != null)
            {
                throw new ErrorResponse(HttpStatusCode.BadRequest, "User already exists");
            }
            if (register.Password != register.ConfirmPassword)
            {
                throw new ErrorResponse(HttpStatusCode.BadRequest, "Passwords don't match");
            }

            var user = _mapper.Map<User>(register);
            user.Password = _encoder.Encrypt(user.Password);

            // Asignación del rol por defecto
            var role = await _roleService.GetOneByName(ROLES.Free);
            user.Roles.Add(role);

            var created = await _userService.CreateOne(user);
            return _mapper.Map<UserDTO>(created);
        }

        public async Task<UserDTO> UpdateRolesToUser(int userId, List<int> roleIds)
        {
            User? user = await _userService.GetOneById(userId);
            if (user == null)
            {
                throw new ErrorResponse(HttpStatusCode.NotFound, "Usuario no encontrado");
            }

            List<Role> roles = await _roleService.GetManyByIds(roleIds);

            user.Roles = roles;

            var updatedUser = await _userService.UpdateOne(user);

            UserDTO mapped = _mapper.Map<UserDTO>(updatedUser);

            return mapped;
        }

        public async Task<UserDTO> GetAuthenticatedUser(HttpContext context)
        {
            int userId = GetUserIdFromContext(context);
            var user = await _userService.GetOneById(userId);
            if (user == null)
            {
                throw new ErrorResponse(HttpStatusCode.NotFound, "Usuario no encontrado");
            }
            return _mapper.Map<UserDTO>(user);
        }
    }
}