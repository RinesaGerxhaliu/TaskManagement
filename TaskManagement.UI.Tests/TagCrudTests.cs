using System.Net.Http.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace TaskManagement.UI.Tests
{
    public class LoginResponseDTO
    {
        public string JwtToken { get; set; } = string.Empty;
    }

    [TestFixture]
    public class TagTests : BaseTest
    {
        private const string ApiBase = "https://localhost:7086/api/Auth";
        private const string LoginUrl = "http://localhost:3000/login";
        private WebDriverWait _wait;

        [SetUp]
        public void Setup()
        {
            _wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(5));
        }

        private void LoginAsAdmin()
        {
            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL")
                                  ?? throw new InvalidOperationException("Set ADMIN_EMAIL");
            var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD")
                                  ?? throw new InvalidOperationException("Set ADMIN_PASSWORD");

            Driver.Navigate().GoToUrl(LoginUrl);
            _wait.Until(d => d.FindElement(By.CssSelector("input[placeholder='Email']")))
                 .SendKeys(adminEmail);
            Driver.FindElement(By.CssSelector("input[placeholder='Password']"))
                  .SendKeys(adminPassword);
            Driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            _wait.Until(d => d.FindElement(By.LinkText("Dashboard"))).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("a[href='/admin/tags']"))).Click();
        }

        [Test]
        public void GetAllTags_RowsOrEmptyMessage()
        {
            LoginAsAdmin();

            _wait.Until(d =>
                d.FindElements(By.CssSelector("tr[data-testid^='tag-row-']")).Any() ||
                d.FindElements(By.CssSelector("table tbody tr td")).Any()
            );

            var rows = Driver.FindElements(By.CssSelector("tr[data-testid^='tag-row-']")).ToList();
            if (rows.Any())
            {
                Assert.That(rows.Count, Is.GreaterThan(0), "Expected at least one tag row.");
            }
            else
            {
                var placeholder = Driver.FindElement(By.CssSelector("table tbody tr td"));
                Assert.That(placeholder.Text.Trim(), Is.EqualTo("No tags found."), "Expected empty-state message.");
            }
        }

        [Test]
        public void Create_Update_Delete_Tag_Via_UI()
        {
            LoginAsAdmin();

            // CREATE
            const string newTagName = "SeleniumTestTag";
            _wait.Until(d => d.FindElement(By.CssSelector("[data-testid='new-tag-input']")))
                 .SendKeys(newTagName);
            Driver.FindElement(By.CssSelector("[data-testid='new-tag-btn']")).Click();

            var createdRow = _wait.Until(d =>
                d.FindElements(By.CssSelector("tr[data-testid^='tag-row-']"))
                 .FirstOrDefault(r => r.Text.Contains(newTagName))
            ) ?? throw new NoSuchElementException($"Tag '{newTagName}' was not created.");
            Assert.That(createdRow.Text, Does.Contain(newTagName));

            var tagId = createdRow.GetAttribute("data-testid").Replace("tag-row-", string.Empty);

            // UPDATE
            Driver.FindElement(By.CssSelector($"[data-testid='edit-btn-{tagId}']")).Click();
            var editInput = _wait.Until(d => d.FindElement(By.CssSelector("[data-testid='edit-tag-input']")));
            const string updatedName = "EditedSeleniumTag";

            editInput.Clear();
            editInput.SendKeys(updatedName);
            Driver.FindElement(By.CssSelector("[data-testid='save-tag-btn']")).Click();

            _wait.Until(d =>
                d.FindElement(By.CssSelector($"tr[data-testid='tag-row-{tagId}']")).Text.Contains(updatedName)
            );
            Assert.That(Driver.PageSource, Does.Contain(updatedName));

            // DELETE
            Driver.FindElement(By.CssSelector($"[data-testid='delete-btn-{tagId}']")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("[data-testid='confirm-delete-btn']"))).Click();
            _wait.Until(d => !Driver.PageSource.Contains(updatedName));

            Assert.False(Driver.PageSource.Contains(updatedName), "Tag was not deleted.");
        }
    }
}
