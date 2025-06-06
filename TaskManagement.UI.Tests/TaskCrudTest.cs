﻿using System;
using System.Linq;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace TaskManagement.UI.Tests
{
    [TestFixture]
    public class TaskCrudTests : BaseTest
    {
        private const string LoginUrl = "http://localhost:3000/login";
        private const string ListUrl = "http://localhost:3000/";

        private WebDriverWait _wait;

        [SetUp]
        public void Init()
        {
            _wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(15));
        }

        [Test]
        public async Task Create_Read_Update_Delete_Task_Via_UI_Login()
        {
            var email = Environment.GetEnvironmentVariable("TEST_USER_EMAIL")
                        ?? throw new InvalidOperationException("Set TEST_USER_EMAIL");
            var pwd = Environment.GetEnvironmentVariable("TEST_USER_PASSWORD")
                        ?? throw new InvalidOperationException("Set TEST_USER_PASSWORD");

            // Navigate to login page
            Driver.Navigate().GoToUrl(LoginUrl);
            _wait.Until(d => d.FindElement(By.CssSelector("input[placeholder='Email']")))
                 .SendKeys(email);
            Driver.FindElement(By.CssSelector("input[placeholder='Password']")).SendKeys(pwd);
            Driver.FindElement(By.CssSelector("button[type='submit']")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("nav")));

            // Go to task list
            Driver.Navigate().GoToUrl(ListUrl);
            var addBtn = _wait.Until(d => d.FindElement(By.CssSelector("button.btn-success")));
            addBtn.Click();

            // Wait for add task form to load
            _wait.Until(d => d.FindElement(By.CssSelector("input[data-testid='task-title']")));
            _wait.Until(d => d.FindElements(By.CssSelector("select[data-testid='task-category'] option")).Count > 1);

            const string originalName = "SeleniumTask";
            Driver.FindElement(By.CssSelector("input[data-testid='task-title']"))
                  .SendKeys(originalName);
            Driver.FindElement(By.CssSelector("textarea[data-testid='task-description']"))
                  .SendKeys("Automated description");

            new SelectElement(Driver.FindElement(By.CssSelector("select[data-testid='task-category']")))
                .SelectByIndex(1);
            new SelectElement(Driver.FindElement(By.CssSelector("select[data-testid='task-status']")))
                .SelectByValue("ToDo");

            Driver.FindElement(By.CssSelector("button[data-testid='submit-task']")).Click();
            var createAlert = _wait.Until(d => d.FindElement(By.CssSelector(".alert-success")));
            Assert.That(createAlert.Text, Does.Contain("Task added"));

            // Check task appears in list
            Driver.Navigate().GoToUrl(ListUrl);
            await Task.Delay(2000);
            _wait.Until(d =>
                d.FindElements(By.CssSelector("table.table-striped tbody tr"))
                 .Any(r => r.Text.Contains(originalName))
            );
            var row = Driver.FindElements(By.CssSelector("table.table-striped tbody tr"))
                            .First(r => r.Text.Contains(originalName));

            // Edit task
            row.FindElement(By.CssSelector("button.btn-outline-primary")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("input[name='title']")));

            var updatedName = originalName + "_Edited";
            var editInput = Driver.FindElement(By.CssSelector("input[name='title']"));
            editInput.Clear();
            editInput.SendKeys(updatedName);

            Driver.FindElement(By.CssSelector("button[type='submit']")).Click();
            var updateAlert = _wait.Until(d => d.FindElement(By.CssSelector(".alert-success")));
            Assert.That(updateAlert.Text, Does.Contain("Task updated"));

            // Verify update
            Driver.Navigate().GoToUrl(ListUrl);
            await Task.Delay(2000);
            _wait.Until(d =>
                d.FindElements(By.CssSelector("table.table-striped tbody tr"))
                 .Any(r => r.Text.Contains(updatedName))
            );
            var updatedRow = Driver.FindElements(By.CssSelector("table.table-striped tbody tr"))
                                   .First(r => r.Text.Contains(updatedName));

            // Delete task
            updatedRow.FindElement(By.CssSelector("button.btn-outline-danger")).Click();
            _wait.Until(d => d.FindElement(By.CssSelector("button.btn-danger"))).Click();

            _wait.Until(d => !d.PageSource.Contains(updatedName));
            Assert.False(Driver.PageSource.Contains(updatedName));
        }
    }
}
