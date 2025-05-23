﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManagement.Infrastructure.Data;

#nullable disable

namespace TaskManagement.Infrastructure.Migrations
{
    [DbContext(typeof(TaskManagementDbContext))]
    [Migration("20250520222633_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("TaskManagement.Domain.Entities.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("TaskItemId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TaskItemId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Priority", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Priorities");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.TaskItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PriorityId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("PriorityId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.TaskTag", b =>
                {
                    b.Property<int>("TaskItemId")
                        .HasColumnType("int");

                    b.Property<int>("TagId")
                        .HasColumnType("int");

                    b.HasKey("TaskItemId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("TaskTags");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Comment", b =>
                {
                    b.HasOne("TaskManagement.Domain.Entities.TaskItem", "TaskItem")
                        .WithMany("Comments")
                        .HasForeignKey("TaskItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TaskItem");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.TaskItem", b =>
                {
                    b.HasOne("TaskManagement.Domain.Entities.Category", "Category")
                        .WithMany("Tasks")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManagement.Domain.Entities.Priority", "Priority")
                        .WithMany("Tasks")
                        .HasForeignKey("PriorityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Priority");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.TaskTag", b =>
                {
                    b.HasOne("TaskManagement.Domain.Entities.Tag", "Tag")
                        .WithMany("TaskTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManagement.Domain.Entities.TaskItem", "TaskItem")
                        .WithMany("TaskTags")
                        .HasForeignKey("TaskItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tag");

                    b.Navigation("TaskItem");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Category", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Priority", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.Tag", b =>
                {
                    b.Navigation("TaskTags");
                });

            modelBuilder.Entity("TaskManagement.Domain.Entities.TaskItem", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("TaskTags");
                });
#pragma warning restore 612, 618
        }
    }
}
