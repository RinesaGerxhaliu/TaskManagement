using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.UI.Tests;
[TestFixture]
public class CategoryTests : BaseTest
{
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
        _wait.Until(d => d.FindElement(By.CssSelector("a[href='/admin/categories']"))).Click();
    }

    [Test]
    public void GetAllCategories_RowsOrEmptyMessage()
    {
        LoginAsAdmin();

        _wait.Until(d =>
            d.FindElements(By.CssSelector("table tbody tr")).Any()
        );

        var rows = Driver.FindElements(By.CssSelector("table tbody tr")).ToList();

        if (rows.Count == 1 && rows[0].Text.Contains("No categories found."))
        {
            Assert.That(rows[0].Text.Trim(), Is.EqualTo("No categories found."), "Expected empty-state message.");
        }
        else
        {
            Assert.That(rows.Count, Is.GreaterThan(0), "Expected category rows.");
        }
    }

    [Test]
    public void Create_Update_Delete_Category_Via_UI()
    {
        LoginAsAdmin();

        // CREATE
        const string newCategoryName = "SeleniumTestCategory";
        _wait.Until(d => d.FindElement(By.CssSelector("input[placeholder='New category name...']")))
             .SendKeys(newCategoryName);
        Driver.FindElement(By.CssSelector("button.btn.btn-light")).Click();

        var createdRow = _wait.Until(d =>
            d.FindElements(By.CssSelector("table tbody tr"))
             .FirstOrDefault(r => r.Text.Contains(newCategoryName))
        ) ?? throw new NoSuchElementException($"Category '{newCategoryName}' was not created.");

        Assert.That(createdRow.Text, Does.Contain(newCategoryName));

        // UPDATE
        var editButton = createdRow.FindElement(By.CssSelector("button.btn-outline-primary"));
        editButton.Click();

        var input = _wait.Until(d => createdRow.FindElement(By.CssSelector("input")));
        const string updatedName = "EditedSeleniumCategory";
        input.Clear();
        input.SendKeys(updatedName);

        createdRow.FindElement(By.CssSelector("button.btn-success")).Click();

        _wait.Until(d =>
            d.FindElement(By.CssSelector("table")).Text.Contains(updatedName)
        );
        Assert.That(Driver.PageSource, Does.Contain(updatedName), "Category name was not updated.");

        // DELETE
        createdRow = _wait.Until(d =>
            d.FindElements(By.CssSelector("table tbody tr"))
             .FirstOrDefault(r => r.Text.Contains(updatedName))
        );

        var deleteButton = createdRow.FindElement(By.CssSelector("button.btn-outline-danger"));
        deleteButton.Click();

        var confirmDeleteButton = _wait.Until(d =>
            d.FindElement(By.CssSelector("button.btn-danger"))
        );
        confirmDeleteButton.Click();

        _wait.Until(d => !d.PageSource.Contains(updatedName));
        Assert.False(Driver.PageSource.Contains(updatedName), "Category was not deleted.");
    }
}

