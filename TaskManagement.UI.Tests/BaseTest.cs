using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace TaskManagement.UI.Tests
{
    public class BaseTest
    {
        protected IWebDriver Driver = null!;

        [SetUp]
        public void Setup()
        {
            Driver = new ChromeDriver();
            Driver.Manage().Window.Maximize();
        }

        [TearDown]
        public void Cleanup()
        {
            Driver?.Quit();
            Driver?.Dispose();
        }
    }
}
