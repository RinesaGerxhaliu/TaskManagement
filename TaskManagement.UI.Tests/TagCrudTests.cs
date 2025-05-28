using System.Net.Http.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using TaskManagement.UI.Tests.TestDTOs;

namespace TaskManagement.UI.Tests
{
    public class LoginResponseDTO
    {
        public string JwtToken { get; set; } = "";
    }

    [TestFixture]
    public class TagCrudTests : BaseTest
    {
        private const string ApiBase = "https://localhost:7086/api/Auth";
        private const string LoginUrl = "http://localhost:3000/login";
        private WebDriverWait _wait;

        [SetUp]
        public void Init()
        {
            _wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(5));
        }

        [Test]
        public async Task Create_Read_Update_Delete_Tag_Via_UI_Login()
        {
            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL")
                                  ?? throw new InvalidOperationException("Set ADMIN_EMAIL");
            var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD")
                                  ?? throw new InvalidOperationException("Set ADMIN_PASSWORD");

            using var http = new HttpClient();

            await http.PostAsJsonAsync(
                $"{ApiBase}/Register",
                new { Username = adminEmail, Password = adminPassword, Roles = new[] { "Admin" } }
            );

            Driver.Navigate().GoToUrl(LoginUrl);
            _wait.Until(d =>
                d.FindElement(By.CssSelector("input[placeholder='Email']"))
            );

            Driver.FindElement(By.CssSelector("input[placeholder='Email']"))
                  .SendKeys(adminEmail);
            Driver.FindElement(By.CssSelector("input[placeholder='Password']"))
                  .SendKeys(adminPassword);
            Driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            _wait.Until(d => d.FindElement(By.CssSelector("nav")));

            _wait.Until(d => d.FindElement(By.LinkText("Dashboard"))).Click();

            _wait.Until(d => d.FindElement(By.CssSelector("a[href='/admin/tags']"))).Click();

            _wait.Until(d =>
                d.FindElement(By.CssSelector("[data-testid='new-tag-input']"))
            );

            // GET ALL
            var apiTags = await http.GetFromJsonAsync<List<TagDto>>(
                // adjust if your TagsController is under /api/Tags
                "https://localhost:7086/api/Tags"
            ) ?? new List<TagDto>();

            _wait.Until(d =>
                d.FindElements(By.CssSelector("tr[data-testid^='tag-row-']")).Count
                  >= apiTags.Count
            );

            var uiRows = Driver.FindElements(By.CssSelector("tr[data-testid^='tag-row-']"));
            Assert.AreEqual(
                apiTags.Count,
                uiRows.Count,
                $"Expected {apiTags.Count} tags from API, but saw {uiRows.Count} in the UI"
            );

            // CREATE

            const string newTagName = "SeleniumTestTag";
            var newNameInput = Driver.FindElement(By.CssSelector("[data-testid='new-tag-input']"));
            newNameInput.SendKeys(newTagName);
            Driver.FindElement(By.CssSelector("[data-testid='new-tag-btn']")).Click();
            IWebElement createdRow = _wait.Until(d =>
            d.FindElements(By.CssSelector("tr[data-testid^='tag-row-']"))
                    .FirstOrDefault(r => r.Text.Contains(newTagName))
               ) ?? throw new NoSuchElementException($"Row with text '{newTagName}' never appeared.");

            Assert.IsTrue(createdRow.Text.Contains(newTagName),
            $"Expected to find '{newTagName}' in the created row.");

            var tagId = createdRow
                             .GetAttribute("data-testid")
                             .Replace("tag-row-", "");

            Assert.AreEqual(newTagName, createdRow.Text,
                "After creation, the tag text should exactly match.");

            // UPDATE

            Driver.FindElement(By.CssSelector($"[data-testid='edit-btn-{tagId}']")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("[data-testid='edit-tag-input']")));
            var editInput = Driver.FindElement(By.CssSelector("[data-testid='edit-tag-input']"));
            editInput.Clear();
            editInput.SendKeys("EditedSeleniumTag");
            Driver.FindElement(By.CssSelector("[data-testid='save-tag-btn']")).Click();
            _wait.Until(d =>
                d.FindElement(By.CssSelector($"[data-testid='tag-row-{tagId}']"))
                 .Text.Contains("EditedSeleniumTag")
            );
            Assert.IsTrue(Driver.PageSource.Contains("EditedSeleniumTag"));

            // DELETE

            Driver.FindElement(By.CssSelector($"[data-testid='delete-btn-{tagId}']")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("[data-testid='confirm-delete-btn']"))).Click();
            _wait.Until(d => !d.PageSource.Contains("EditedSeleniumTag"));
            Assert.False(Driver.PageSource.Contains("EditedSeleniumTag"));
        }
    }
}
