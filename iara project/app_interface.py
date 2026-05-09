import customtkinter as ctk
import logic_helper as logic


class IARAGUI(ctk.CTk):
    def __init__(self):
        super().__init__()
        # Window Configuration
        self.title("ИАРА - Регистър на риболовните кораби")
        self.geometry("1100x600")

        # Sidebar setup
        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar.pack(side="left", fill="y")

        self.label = ctk.CTkLabel(self.sidebar, text="ИАРА ПОРТАЛ", font=("Arial", 20, "bold"))
        self.label.pack(pady=30, padx=20)

        # Menu Buttons
        self.btn_registry = ctk.CTkButton(self.sidebar, text="Регистър Кораби",
                                          command=self.show_vessel_registry)
        self.btn_registry.pack(pady=10, padx=20)

        # Main Content Area (Scrollable to handle long lists)
        self.display_area = ctk.CTkScrollableFrame(self, corner_radius=15)
        self.display_area.pack(side="right", fill="both", expand=True, padx=20, pady=20)

        self.show_welcome()

    def clear_display(self):
        """Helper to wipe the screen before drawing a new view."""
        for widget in self.display_area.winfo_children():
            widget.destroy()

    def show_welcome(self):
        self.clear_display()
        welcome = ctk.CTkLabel(self.display_area, text="Добре дошли в системата на ИАРА", font=("Arial", 24))
        welcome.pack(pady=100)

    def show_vessel_registry(self):
        """Displays the table of all registered vessels."""
        self.clear_display()

        header = ctk.CTkLabel(self.display_area, text="Регистър на риболовните кораби", font=("Arial", 22, "bold"))
        header.pack(pady=(10, 20))

        # Create the table grid container
        table_frame = ctk.CTkFrame(self.display_area)
        table_frame.pack(fill="x", padx=10)

        # Define Headers
        headers = ["CFR Номер", "Име на кораб", "Собственик", "Параметри", "Статус"]
        for i, h_text in enumerate(headers):
            lbl = ctk.CTkLabel(table_frame, text=h_text, font=("Arial", 12, "bold"), width=140)
            lbl.grid(row=0, column=i, padx=5, pady=5)

        # Fetch vessels from logic_helper.py
        vessels = logic.get_vessel_registry()

        # Populate the table rows
        for index, ship in enumerate(vessels):
            # We use index+1 because the header is row 0
            ctk.CTkLabel(table_frame, text=ship["cfr"]).grid(row=index + 1, column=0, pady=2)
            ctk.CTkLabel(table_frame, text=ship["name"]).grid(row=index + 1, column=1, pady=2)
            ctk.CTkLabel(table_frame, text=ship["owner"]).grid(row=index + 1, column=2, pady=2)
            ctk.CTkLabel(table_frame, text=ship["params"]).grid(row=index + 1, column=3, pady=2)
            ctk.CTkLabel(table_frame, text=ship["status"]).grid(row=index + 1, column=4, pady=2)

        # Navigation to the registration form
        btn_add = ctk.CTkButton(self.display_area, text="+ Регистрирай нов кораб",
                                fg_color="green", hover_color="darkgreen",
                                command=self.show_add_vessel_form)
        btn_add.pack(pady=30)

    def show_add_vessel_form(self):
        """Displays the input form for new registrations."""
        self.clear_display()

        ctk.CTkLabel(self.display_area, text="Регистрация на нов кораб", font=("Arial", 22, "bold")).pack(pady=20)

        # Create Entry fields and store them as self. variables so handle_save can read them
        self.entry_cfr = self.create_input_field("CFR Номер (МН номер):")
        self.entry_name = self.create_input_field("Име на кораба:")
        self.entry_owner = self.create_input_field("Собственик:")
        self.entry_power = self.create_input_field("Мощност на двигател (HP):")

        # Save Action
        btn_save = ctk.CTkButton(self.display_area, text="Запази в Регистъра",
                                 command=self.handle_save)
        btn_save.pack(pady=20)

        # Cancel Action
        btn_back = ctk.CTkButton(self.display_area, text="Отказ", fg_color="transparent",
                                 border_width=1, command=self.show_vessel_registry)
        btn_back.pack()

    def create_input_field(self, label_text):
        """Helper to create a label and an entry together."""
        ctk.CTkLabel(self.display_area, text=label_text).pack(pady=(10, 0))
        entry = ctk.CTkEntry(self.display_area, width=350)
        entry.pack(pady=(0, 10))
        return entry

    def handle_save(self):
        """Reads input data and sends it to the logic layer."""
        cfr_val = self.entry_cfr.get()
        name_val = self.entry_name.get()
        owner_val = self.entry_owner.get()
        power_val = self.entry_power.get()

        # Call the logic helper to update the database list
        if logic.save_vessel(cfr_val, name_val, owner_val, power_val):
            # Refresh the table view so we see the new ship
            self.show_vessel_registry()