import {
  SUPPORTED_GENDERS,
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_USER_ROLES,
  SUPPORTED_SHIPMENT_STATUSES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
  SUPPORTED_VEHICLE_TYPES,
  SUPPORTED_SHIPMENT_TYPES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  SUPPORTED_ACTIVITY_VERB,
  SUPPORTED_ACTIVITY_ENTITY,
  SUPPORTED_PACKAGE_REMARKS,
  SUPPORTED_UPLOADED_MANIFEST_STATUS,
} from "../../utils/constants"
import {
  bigserial,
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  primaryKey,
  decimal,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  photoUrl: text("photo_url"),
  emailAddress: varchar("email_address", { length: 100 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
  gender: text("gender", {
    enum: SUPPORTED_GENDERS,
  }).notNull(),
  role: text("role", {
    enum: SUPPORTED_USER_ROLES,
  }).notNull(),
  isEnabled: integer("is_enabled").notNull().default(1),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export const warehouseStaffs = pgTable("warehouse_staffs", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  warehouseId: bigserial("warehouse_id", {
    mode: "number",
  }).notNull(),
})

export const drivers = pgTable("drivers", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  licenseNumber: varchar("license_number", {
    length: 100,
  }).notNull(),
  licenseRegistrationDate: varchar("license_registration_date", {
    length: 10,
  }).notNull(),
})

export const driverAssignedAreas = pgTable(
  "driver_assigned_areas",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    areaCode: varchar("area_code", { length: 10 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.areaCode],
    }),
  }),
)

export const overseasAgents = pgTable("overseas_agents", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  companyName: varchar("company_name", {
    length: 100,
  }).notNull(),
})

export const uploadedManifests = pgTable("uploaded_manifests", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 28,
  }).notNull(),
  downloadUrl: text("download_url").notNull(),
  status: text("status", {
    enum: SUPPORTED_UPLOADED_MANIFEST_STATUS,
  }).notNull(),
  reuploadRequestRemarks: varchar("reupload_request_remarks", {
    length: 100,
  }),
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }),
  createdAt: varchar("created_at", {
    length: 100,
  }).notNull(),
})

export const domesticAgents = pgTable("domestic_agents", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  companyName: varchar("company_name", {
    length: 100,
  }).notNull(),
})

export const shipments = pgTable("shipments", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  type: text("type", {
    enum: SUPPORTED_SHIPMENT_TYPES,
  }).notNull(),
  status: text("status", {
    enum: SUPPORTED_SHIPMENT_STATUSES,
  }).notNull(),
  isArchived: integer("is_archived").notNull().default(0),
})

export const shipmentPackages = pgTable(
  "shipment_packages",
  {
    shipmentId: bigserial("shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: varchar("package_id", { length: 36 }).notNull(),
    status: text("status", {
      enum: SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
    }).notNull(),
    isDriverApproved: integer("is_driver_approved").notNull().default(0),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.shipmentId, table.packageId],
    }),
  }),
)

export const shipmentPackageOtps = pgTable(
  "shipment_package_otps",
  {
    shipmentId: bigserial("shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: varchar("package_id", { length: 36 }).notNull(),
    isValid: integer("is_valid").notNull().default(1),
    code: integer("code").notNull(),
    expireAt: varchar("expire_at", {
      length: 255,
    }).notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.shipmentId, table.packageId],
      }),
    }
  },
)

export const shipmentLocations = pgTable("shipment_locations", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).notNull(),
  long: doublePrecision("long").notNull(),
  lat: doublePrecision("lat").notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const incomingShipments = pgTable("incoming_shipments", {
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).primaryKey(),
  sentByAgentId: varchar("sent_by_agent_id", {
    length: 28,
  }).notNull(),
  destinationWarehouseId: bigserial("destination_warehouse_id", {
    mode: "number",
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const forwarderTransferShipments = pgTable(
  "forwarder_transfer_shipments",
  {
    shipmentId: bigserial("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigserial("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentToAgentId: varchar("sent_to_agent_id", {
      length: 28,
    }).notNull(),
    departingWarehouseId: bigserial("departing_warehouse_id", {
      mode: "number",
    }).notNull(),
    proofOfTransferImgUrl: text("proof_of_transfer_img_url"),
    isTransferConfirmed: integer("is_transfer_confirmed").notNull().default(0),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
)

export const warehouseTransferShipments = pgTable(
  "warehouse_transfer_shipments",
  {
    shipmentId: bigserial("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigserial("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentFromWarehouseId: bigserial("sent_from_warehouse_id", {
      mode: "number",
    }).notNull(),
    sentToWarehouseId: bigserial("sent_to_warehouse_id", {
      mode: "number",
    }).notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
)

export const deliveryShipments = pgTable("delivery_shipments", {
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).primaryKey(),
  driverId: varchar("driver_id", {
    length: 28,
  }).notNull(),
  vehicleId: bigserial("vehicle_id", {
    mode: "number",
  }).notNull(),
  isExpress: integer("is_express").notNull(),
  departureAt: varchar("departure_at", {
    length: 100,
  }).notNull(),
  departingWarehouseId: bigserial("departing_warehouse_id", {
    mode: "number",
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  nextToBeDeliveredPackageId: varchar("next_to_be_delivered_package_id", {
    length: 36,
  }),
})

export const warehouses = pgTable("warehouses", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  volumeCapacityInCubicMeter: doublePrecision(
    "volume_capacity_in_cubic_meter",
  ).notNull(),
  targetUtilization: doublePrecision("target_utilization").notNull(),
  isArchived: integer("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const vehicles = pgTable("vehicles", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  type: text("type", {
    enum: SUPPORTED_VEHICLE_TYPES,
  }).notNull(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  plateNumber: varchar("plate_number", {
    length: 15,
  })
    .notNull()
    .unique(),
  weightCapacityInKg: doublePrecision("weight_capacity_in_kg").notNull(),
  isExpressAllowed: integer("is_express_allowed").notNull(),
  isMaintenance: integer("is_maintenance").notNull(),
  isArchived: integer("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const inquiries = pgTable("inquiries", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  fullName: varchar("full_name", {
    length: 100,
  }).notNull(),
  emailAddress: varchar("email_address", {
    length: 100,
  }).notNull(),
  message: varchar("message", {
    length: 100,
  }).notNull(),
  isArchived: integer("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const survey = pgTable("survey", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  packageId: varchar("package_id", { length: 36 }).notNull(),
  serviceRate: integer("service_rate").notNull(),
  message: varchar("message", {
    length: 100,
  }).notNull(),
  isArchived: integer("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const packageCategories = pgTable("package_categories", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const packages = pgTable("packages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  preassignedId: varchar("preassigned_id", { length: 100 }).notNull(),
  shippingMode: text("shipping_mode", {
    enum: SUPPORTED_PACKAGE_SHIPPING_MODES,
  }).notNull(),
  shippingType: text("shippingtype", {
    enum: SUPPORTED_PACKAGE_SHIPPING_TYPES,
  }).notNull(),
  receptionMode: text("reception_mode", {
    enum: SUPPORTED_PACKAGE_RECEPTION_MODES,
  }).notNull(),
  remarks: text("remarks", {
    enum: SUPPORTED_PACKAGE_REMARKS,
  }),
  weightInKg: doublePrecision("weight_in_kg").notNull(),
  volumeInCubicMeter: doublePrecision("volume_in_cubic_meter").notNull(),
  senderFullName: varchar("sender_full_name", { length: 100 }).notNull(),
  senderContactNumber: varchar("sender_contact_number", {
    length: 15,
  }).notNull(),
  senderEmailAddress: varchar("sender_email_address", {
    length: 100,
  }).notNull(),
  senderStreetAddress: varchar("sender_street_address", {
    length: 255,
  }).notNull(),
  senderCity: varchar("sender_city", {
    length: 100,
  }).notNull(),
  senderStateOrProvince: varchar("sender_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  senderCountryCode: varchar("sender_country_code", { length: 3 }).notNull(),
  senderPostalCode: integer("sender_postal_code").notNull(),
  receiverFullName: varchar("receiver_full_name", { length: 100 }).notNull(),
  receiverContactNumber: varchar("receiver_contact_number", {
    length: 15,
  }).notNull(),
  receiverEmailAddress: varchar("receiver_email_address", {
    length: 100,
  }).notNull(),
  receiverStreetAddress: varchar("receiver_street_address", {
    length: 255,
  }).notNull(),
  receiverBarangay: varchar("receiver_barangay", {
    length: 100,
  }).notNull(),
  receiverCity: varchar("receiver_city", {
    length: 100,
  }).notNull(),
  receiverStateOrProvince: varchar("receiver_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  receiverCountryCode: varchar("receiver_country_code", {
    length: 3,
  }).notNull(),
  receiverPostalCode: integer("receiver_postal_code").notNull(),
  proofOfDeliveryImgUrl: text("proof_of_delivery_img_url"),
  proofOfDeliverySignatureUrl: text("proof_of_delivery_sig_url"),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  settledAt: varchar("settled_at", {
    length: 255,
  }),
  updatedById: varchar("updated_by_id", { length: 28 }).notNull(),
  isArchived: integer("is_archived").notNull().default(0),
  isDeliverable: integer("is_deliverable").notNull(),
  isUnmanifested: integer("is_unmanifested").notNull().default(0),
  lastWarehouseId: bigserial("last_warehouse_id", {
    mode: "number",
  }),
  lastCoordinates: varchar("last_coordinates", {
    length: 100,
  }),
  expectedHasDeliveryAt: varchar("expected_has_delivery_at", {
    length: 100,
  }),
  expectedIsDeliveredAt: varchar("expected_is_delivered_at", {
    length: 100,
  }),
  isFragile: integer("is_fragile").notNull(),
  status: text("status", {
    enum: SUPPORTED_PACKAGE_STATUSES,
  }).notNull(),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  declaredValue: doublePrecision("declared_value"),
  areaCode: varchar("area_code", { length: 100 }).notNull(),
  sentByAgentId: varchar("sent_by_agent_id", { length: 28 }).notNull(),
})
export const missingPackages = pgTable("missing_packages", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  packageId: varchar("package_id", { length: 36 }).notNull(),
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).notNull(),
  preassignedId: varchar("preassigned_id", { length: 100 }).notNull(),
  shippingMode: text("shipping_mode", {
    enum: SUPPORTED_PACKAGE_SHIPPING_MODES,
  }).notNull(),
  shippingType: text("shippingtype", {
    enum: SUPPORTED_PACKAGE_SHIPPING_TYPES,
  }).notNull(),

  weightInKg: doublePrecision("weight_in_kg").notNull(),
  volumeInCubicMeter: doublePrecision("volume_in_cubic_meter").notNull(),
  senderFullName: varchar("sender_full_name", { length: 100 }).notNull(),
  senderContactNumber: varchar("sender_contact_number", {
    length: 15,
  }).notNull(),
  senderEmailAddress: varchar("sender_email_address", {
    length: 100,
  }).notNull(),
  senderStreetAddress: varchar("sender_street_address", {
    length: 255,
  }).notNull(),
  senderCity: varchar("sender_city", {
    length: 100,
  }).notNull(),
  senderStateOrProvince: varchar("sender_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  senderCountryCode: varchar("sender_country_code", { length: 3 }).notNull(),
  senderPostalCode: integer("sender_postal_code").notNull(),
  receiverFullName: varchar("receiver_full_name", { length: 100 }).notNull(),
  receiverContactNumber: varchar("receiver_contact_number", {
    length: 15,
  }).notNull(),
  receiverEmailAddress: varchar("receiver_email_address", {
    length: 100,
  }).notNull(),
  receiverStreetAddress: varchar("receiver_street_address", {
    length: 255,
  }).notNull(),
  receiverBarangay: varchar("receiver_barangay", {
    length: 100,
  }).notNull(),
  receiverCity: varchar("receiver_city", {
    length: 100,
  }).notNull(),
  receiverStateOrProvince: varchar("receiver_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  receiverCountryCode: varchar("receiver_country_code", {
    length: 3,
  }).notNull(),
  receiverPostalCode: integer("receiver_postal_code").notNull(),

  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),

  isFragile: integer("is_fragile").notNull(),

  sentByAgentId: varchar("sent_by_agent_id", { length: 28 }).notNull(),
})

export const packageMonitoringAccessKeys = pgTable(
  "package_monitoring_access_keys",
  {
    packageId: varchar("package_id", { length: 36 }).notNull(),
    accessKey: varchar("access_key", { length: 36 }).notNull(),
    isValid: integer("is_valid").notNull().default(1),
    createdAt: varchar("created_at", {
      length: 100,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.packageId, table.accessKey],
    }),
  }),
)

export const packageStatusLogs = pgTable("package_status_logs", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  packageId: varchar("package_id", { length: 36 }).notNull(),
  status: text("status", {
    enum: SUPPORTED_PACKAGE_STATUSES,
  }).notNull(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const activities = pgTable("activities", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  verb: text("verb", {
    enum: SUPPORTED_ACTIVITY_VERB,
  }).notNull(),
  entity: text("entity", {
    enum: SUPPORTED_ACTIVITY_ENTITY,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  isArchived: integer("is_archived").notNull().default(0),
})

export const webpushSubscriptions = pgTable(
  "webpush_subscriptions",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    endpointHashed: varchar("endpoint_hashed", {
      length: 64,
    }).notNull(),
    endpoint: text("endpoint").notNull(),
    expirationTime: integer("expiration_time"),
    keyAuth: text("key_auth").notNull(),
    keyP256dh: text("key_p256dh").notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.endpointHashed],
      }),
    }
  },
)

export const webauthnChallenges = pgTable("webauthn_challenges", {
  userId: varchar("user_id", { length: 28 }).primaryKey(),
  challenge: text("challenge").notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: varchar("id", {
    length: 256,
  }).primaryKey(),
  deviceName: varchar("device_name", {
    length: 100,
  }).notNull(),
  userId: varchar("user_id", { length: 28 }).notNull(),
  key: text("key").notNull(),
  transports: text("transports").notNull(),
  counter: integer("counter").notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const expopushTokens = pgTable(
  "expopush_tokens",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    data: varchar("data", {
      length: 100,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.data],
      }),
    }
  },
)

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    tokenHashed: varchar("token_hashed", {
      length: 64,
    }).notNull(),
    isValid: integer("is_valid").notNull().default(1),
    expireAt: varchar("expire_at", {
      length: 100,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.tokenHashed],
      }),
    }
  },
)

export const deliverableProvinces = pgTable("deliverable_provinces", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 100,
  }).notNull(),
})

export const assignedDrivers = pgTable("assigned_drivers", {
  driverId: varchar("user_id", {
    length: 28,
  }).primaryKey(),
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).notNull(),
})

export const assignedVehicles = pgTable("assigned_vehicles", {
  vehicleId: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  shipmentId: bigserial("shipment_id", {
    mode: "number",
  }).notNull(),
})

export const barangays = pgTable("barangays", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  cityId: varchar("city_id", {
    length: 6,
  }).notNull(),
  published: integer("published").notNull().default(0),
  shippingFee: decimal("shipping_fee", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0.00"),
})

export const cities = pgTable("cities", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  cityId: varchar("city_id", {
    length: 6,
  }).notNull(),
  published: integer("published").notNull().default(0),
})

export const provinces = pgTable("provinces", {
  id: bigserial("id", {
    mode: "number",
  }).primaryKey(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  published: integer("published").notNull().default(0),
})
