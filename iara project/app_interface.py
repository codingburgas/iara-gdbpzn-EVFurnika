import customtkinter as ctk
from PIL import Image
import logic_helper as logic
import theme_config as style
import os


class IARAGUI(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Initial Window Setup
        ctk.set_appearance_mode("dark")
        self.title("⚓ ИАРА | Информационна Система")
        self.geometry("1300x850")

        # --- Sidebar ---
        self.sidebar = ctk.CTkFrame(self, width=240, corner_radius=0)
        self.sidebar.pack(side="left", fill="y")

        # Clickable Logo next to Text
        self.load_sidebar_logo()

        # Navigation Buttons
        self.btn_home = ctk.CTkButton(self.sidebar, text="🏠 Начало", height=45,
                                      fg_color="transparent", text_color=("black", "white"),
                                      anchor="w", command=self.show_dashboard)
        self.btn_home.pack(pady=5, padx=20, fill="x")

        self.btn_registry = ctk.CTkButton(self.sidebar, text="📦 Флотски Регистър",
                                          height=45, fg_color=style.COLOR_BRAND,
                                          text_color=("white", "black"),
                                          anchor="w", command=self.show_vessel_registry)
        self.btn_registry.pack(pady=5, padx=20, fill="x")

        # Theme Switcher
        self.theme_switch = ctk.CTkSwitch(self.sidebar, text="Тъмен Режим", command=self.toggle_theme)
        self.theme_switch.select()
        self.theme_switch.pack(side="bottom", pady=20)

        # --- Main Area ---
        self.display_area = ctk.CTkScrollableFrame(self, corner_radius=0, fg_color="transparent")
        self.display_area.pack(side="right", fill="both", expand=True, padx=10, pady=10)

        # Default Start Page
        self.show_dashboard()

    def load_sidebar_logo(self):
        """Loads logo and makes the title clickable to go home."""
        try:
            img = Image.open("logo.png")
            self.logo_img = ctk.CTkImage(light_image=img, dark_image=img, size=(50, 50))
            self.logo_btn = ctk.CTkButton(self.sidebar, image=self.logo_img, text=" ИАРА",
                                          font=style.FONT_TITLE, fg_color="transparent",
                                          hover=False, command=self.show_dashboard)
            self.logo_btn.pack(pady=40, padx=10)
        except Exception:
            self.logo_label = ctk.CTkLabel(self.sidebar, text="⚓ ИАРА", font=style.FONT_TITLE)
            self.logo_label.pack(pady=40)

    def toggle_theme(self):
        ctk.set_appearance_mode("dark" if self.theme_switch.get() == 1 else "light")

    def clear_display(self):
        for widget in self.display_area.winfo_children():
            widget.destroy()

    # --- PAGE: DASHBOARD ---
    def show_dashboard(self):
        self.clear_display()

        # Welcome Banner
        try:
            banner_img = Image.open("intro_banner.jpg")
            self.banner = ctk.CTkImage(light_image=banner_img, dark_image=banner_img, size=(900, 300))
            banner_label = ctk.CTkLabel(self.display_area, image=self.banner, text="")
            banner_label.pack(pady=(0, 20))
        except Exception:
            pass

        # Intro Content
        text_frame = ctk.CTkFrame(self.display_area, fg_color="transparent")
        text_frame.pack(fill="x", padx=50)

        ctk.CTkLabel(text_frame, text="Система за управление на флота", font=style.FONT_TITLE).pack(anchor="w")
        ctk.CTkLabel(text_frame, text="Добре дошли в официалния портал на ИАРА. Тук можете да преглеждате "
                                      "актуалния регистър на корабите и да вписвате нови плавателни съдове.",
                     font=style.FONT_INFO, text_color=style.COLOR_TEXT_DIM, wraplength=800, justify="left").pack(
            anchor="w", pady=10)

        # News Section
        news_frame = ctk.CTkFrame(self.display_area, fg_color=style.COLOR_CARD_BG, corner_radius=15)
        news_frame.pack(fill="x", padx=50, pady=30)

        ctk.CTkLabel(news_frame, text="📰 Последни известия", font=style.FONT_CARD_TITLE).pack(anchor="w", padx=25,
                                                                                              pady=15)

        news = [
            "• Промени в Закона за рибарството и аквакултурите - 2026",
            "• Обновени квоти за улов в черноморския регион",
            "• Инструкции за ползване на дигиталния регистър"
        ]
        for item in news:
            ctk.CTkLabel(news_frame, text=item, font=style.FONT_INFO).pack(anchor="w", padx=40, pady=5)

    # --- PAGE: REGISTRY ---
    def show_vessel_registry(self):
        self.clear_display()

        header_bar = ctk.CTkFrame(self.display_area, fg_color="transparent")
        header_bar.pack(fill="x", padx=30, pady=30)

        ctk.CTkLabel(header_bar, text="Флотски Регистър", font=style.FONT_TITLE).pack(side="left")

        btn_add = ctk.CTkButton(header_bar, text="+ РЕГИСТРИРАЙ КОРАБ",
                                fg_color=style.COLOR_BRAND, text_color=("white", "black"),
                                font=("Segoe UI", 14, "bold"), height=45,
                                command=self.show_add_vessel_form)
        btn_add.pack(side="right")

        grid_container = ctk.CTkFrame(self.display_area, fg_color="transparent")
        grid_container.pack(fill="both", expand=True, padx=20, pady=10)
        grid_container.grid_columnconfigure((0, 1), weight=1)

        vessels = logic.get_vessel_registry()
        for idx, ship in enumerate(vessels):
            self.create_vessel_card(grid_container, ship, idx)

    def create_vessel_card(self, parent, ship, idx):
        card = ctk.CTkFrame(parent, fg_color=style.COLOR_CARD_BG, border_color=style.COLOR_CARD_BORDER,
                            border_width=2, corner_radius=style.CORNER_RADIUS)
        card.grid(row=idx // 2, column=idx % 2, padx=15, pady=15, sticky="nsew")

        content = ctk.CTkFrame(card, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=25, pady=25)

        ctk.CTkLabel(content, text=ship["name"], font=style.FONT_CARD_TITLE).pack(anchor="w")

        # Visual Separator
        ctk.CTkFrame(content, height=2, fg_color=style.COLOR_CARD_BORDER).pack(fill="x", pady=15)

        status_color = "#10B981" if ship["status"] == "Активен" else "#F59E0B"
        ctk.CTkLabel(content, text=f"● {ship['status'].upper()}",
                     font=style.FONT_BADGE, text_color=status_color).pack(anchor="w")

        details = f"🚢 CFR: {ship['cfr']}\n👤 Собственик: {ship['owner']}\n🔧 {ship['params']}"
        ctk.CTkLabel(content, text=details, font=style.FONT_INFO, justify="left", anchor="w").pack(fill="x",
                                                                                                   pady=(15, 0))

    # --- PAGE: ADD VESSEL ---
    def show_add_vessel_form(self):
        self.clear_display()
        form = ctk.CTkFrame(self.display_area, fg_color=style.COLOR_CARD_BG, corner_radius=20)
        form.pack(pady=60)

        ctk.CTkLabel(form, text="Нова Регистрация", font=style.FONT_TITLE).pack(pady=30, padx=60)

        self.entry_cfr = self.create_styled_input(form, "CFR Номер")
        self.entry_name = self.create_styled_input(form, "Име на плавателния съд")
        self.entry_owner = self.create_styled_input(form, "Собственик")
        self.entry_power = self.create_styled_input(form, "Мощност (HP)")

        ctk.CTkButton(form, text="Впиши в Регистъра", fg_color=style.COLOR_BRAND,
                      text_color=("white", "black"), height=50, font=("Segoe UI", 14, "bold"),
                      command=self.handle_save).pack(pady=40, padx=60, fill="x")

        ctk.CTkButton(form, text="Отказ", fg_color="transparent", border_width=1,
                      command=self.show_vessel_registry).pack(pady=(0, 30))

    def create_styled_input(self, parent, label):
        ctk.CTkLabel(parent, text=label, font=style.FONT_INFO).pack(anchor="w", padx=60)
        e = ctk.CTkEntry(parent, width=450, height=45)
        e.pack(pady=(5, 15), padx=60)
        return e

    def handle_save(self):
        if logic.save_vessel(self.entry_cfr.get(), self.entry_name.get(),
                             self.entry_owner.get(), self.entry_power.get()):
            self.show_vessel_registry()