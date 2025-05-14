import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ThemeService } from "../../services/theme/theme.service"
import { UserService } from "../../services/user/user.service"
import { AuthService } from "../../services/auth/auth.service"

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
})
export class SettingsComponent implements OnInit {
  currentUser: any
  activeTab = "profile"

  // Theme settings
  themeMode: "dark" | "light" = "dark"
  accentColor = "#d59039"
  fontSize: "small" | "medium" | "large" = "medium"

  // Predefined accent colors
  accentColors = [
    { name: "Gold", value: "#d59039" },
    { name: "Blue", value: "#3498db" },
    { name: "Green", value: "#2ecc71" },
    { name: "Purple", value: "#9b59b6" },
    { name: "Red", value: "#e74c3c" },
    { name: "Teal", value: "#1abc9c" },
  ]

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.loadUserData()
    this.loadThemeSettings()
  }

  loadUserData(): void {
    // Get current user data from service
    this.userService.user.subscribe((user) => {
      if (user) {
        this.currentUser = user
      }
    })
  }

  loadThemeSettings(): void {
    this.themeService.themeSettings.subscribe((settings) => {
      this.themeMode = settings.theme
      this.accentColor = settings.accentColor
    })
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  updateTheme(theme: "dark" | "light"): void {
    this.themeMode = theme
    this.themeService.updateTheme(theme)
  }

  updateAccentColor(color: string): void {
    this.accentColor = color
    this.themeService.updateAccentColor(color)
  }

  logout(): void {
    // Clear auth token
    sessionStorage.removeItem("authToken")

    // Navigate to login page
    this.router.navigate(["/"])
  }
}
