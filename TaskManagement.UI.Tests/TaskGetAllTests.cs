using System;
using System.Linq;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace TaskManagement.UI.Tests
{
    [TestFixture]
    public class TaskGetAllTests : BaseTest
    {
        private const string LoginUrl = "http://localhost:3000/login";
        private const string ListUrl = "http://localhost:3000/";
        private WebDriverWait _wait;

        [SetUp]
        public void Init()
        {
            _wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(8));
        }

        private Task LoginAsync()
        {
            var email = Environment.GetEnvironmentVariable("TEST_USER_EMAIL")
                        ?? throw new InvalidOperationException("Set TEST_USER_EMAIL");
            var pwd = Environment.GetEnvironmentVariable("TEST_USER_PASSWORD")
                      ?? throw new InvalidOperationException("Set TEST_USER_PASSWORD");

            Driver.Navigate().GoToUrl(LoginUrl);
            _wait.Until(d => d.FindElement(By.CssSelector("input[placeholder='Email']"))).SendKeys(email);
            Driver.FindElement(By.CssSelector("input[placeholder='Password']")).SendKeys(pwd);
            Driver.FindElement(By.CssSelector("button[type='submit']")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("nav")));

            return Task.CompletedTask;
        }

        [Test]
        public async Task GetAllTasks_ShouldShowRowsOrNoTasksPlaceholder()
        {
            await LoginAsync();
            Driver.Navigate().GoToUrl(ListUrl);
            await Task.Delay(2000);

            _wait.Until(d =>
                d.FindElements(By.CssSelector("table.table-striped tbody tr")).Any() ||
                d.FindElements(By.CssSelector("tbody tr td"))
                 .Any(td => td.Text.Contains("No tasks found"))
            );

            var rows = Driver
                .FindElements(By.CssSelector("table.table-striped tbody tr"))
                .Where(r => !string.IsNullOrWhiteSpace(r.Text))
                .ToList();

            if (rows.Count == 0)
            {
                var placeholder = Driver.FindElement(By.CssSelector("tbody tr td")).Text.Trim();
                Assert.That(placeholder, Does.Contain("No tasks found"));
            }
            else
            {
                Assert.That(rows.Count, Is.GreaterThan(0), "Expected at least one task row");
            }
        }
    }
}
