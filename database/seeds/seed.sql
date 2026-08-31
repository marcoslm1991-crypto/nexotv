-- NexoTV Seed SQL Script
-- Inserción de planes por defecto e información de prueba

-- Planes por defecto
INSERT INTO "plans" ("id", "name", "code", "max_screens", "max_profiles", "description", "is_active", "created_at", "updated_at")
VALUES 
  ('plan-individual-id', 'Plan Individual', 'INDIVIDUAL', 1, 1, '1 pantalla simultánea, 1 perfil', true, NOW(), NOW()),
  ('plan-familiar-id', 'Plan Familiar', 'FAMILIAR', 3, 3, 'Hasta 3 pantallas simultáneas, hasta 3 perfiles independientes', true, NOW(), NOW()),
  ('plan-familiar-plus-id', 'Plan Familiar Plus', 'FAMILIAR_PLUS', 5, 5, 'Hasta 5 pantallas simultáneas, hasta 5 perfiles independientes', true, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- Usuario Administrador por defecto (clave hasheada para 'admin123')
INSERT INTO "users" ("id", "alias", "name", "password_hash", "role", "is_active", "created_at", "updated_at")
VALUES
  ('admin-user-id', 'admin', 'Administrador NexoTV', '$2b$10$wB5W8Uo7nFf9lY0d7W8k0e0M1R4e.Y8uG5w/G9H0J1K2L3M4N5O6P', 'ADMIN', true, NOW(), NOW())
ON CONFLICT ("alias") DO NOTHING;
