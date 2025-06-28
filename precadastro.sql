--SGH-auth
--table: usuario
--login: a@a.com - uMBHf521OG - PACIENTE
--login: b@b.com - 61xusnnI09 - FUNCIONARIO
INSERT INTO usuario (id, cpf, email, nome, perfil, salt, senha_hash) VALUES
(1, '00000000000', 'a@a.com', 'Paciente 1', 'PACIENTE', 'jAW+YrTNsHAAOA29s+iNgQ==', '1oLOeTLjLYCEzRHeA3R34L+zS3P99UsGOKVNCguMIng='),
(2, '00000000001', 'b@b.com', 'Funcionario Exemplar', 'FUNCIONARIO', 'VKPfe2bD/6GIrld/QLwaKw==', 'mu9qnQCHln62t7JSzO0Gds+JUOEp2c7V1E65zo5YWKk=');

--SGH-user
--table: endereco
INSERT INTO endereco (id, cep, cidade, estado, numero, rua) VALUES
(1, '00000000', 'Cidade', 'PR', '0', 'Rua A');

--table:paciente
INSERT INTO paciente (id, cpf, email, nome, saldo_pontos, endereco_id) VALUES
(1, '00000000000', 'a@a.com', 'Paciente 1', 0, 1);


--SGH-consulta
--table: especialidade
INSERT INTO especialidade (id, nome) VALUES
(1, 'Ortopedia'),
(2, 'Pediatria'),
(3, 'Dermatologia'),
(4, 'Cardiologia'),
(5, 'Oftalmologia'),
(6, 'Pneumologia'),
(7, 'Endocrinologia'),
(8, 'Neurologia');

--table: profissional
INSERT INTO profissional (id, crm, nome, status, telefone) VALUES
(1, '123456', 'Carlos Alberto', 'ATIVO', '41 9999-8999'),
(2, '123457', 'Fernanda Lima', 'ATIVO', '41 9999-8999'),
(3, '123458', 'Gustavo Mello', 'ATIVO', '41 9999-8979'),
(4, '123459', 'Helena Costa', 'ATIVO', '41 9999-8959'),
(5, '123410', 'Isabel Soares', 'ATIVO', '41 9999-8799'),
(6, '123411', 'João Pereira', 'ATIVO', '41 9999-7999'),
(7, '123412', 'Kelly Rocha', 'ATIVO', '41 9999-6999'),
(8, '123413', 'Pedro Mendes', 'ATIVO', '41 9999-5999');

--table: consulta
INSERT INTO consulta (id, data_hora, status, vagas_disponiveis, total_vagas, valor_em_pontos, profissional_id, especialidade_id) VALUES
(1, '2025-07-01 09:00:00', 'DISPONÍVEL', 10, 10, 100, 1, 2),
(2, '2025-07-01 10:00:00', 'DISPONÍVEL', 8, 9, 80, 2, 3),
(3, '2025-07-01 11:00:00', 'DISPONÍVEL', 5, 6, 120, 3, 4),
(4, '2025-07-01 13:00:00', 'DISPONÍVEL', 12, 13, 90, 4, 5),
(5, '2025-07-01 14:00:00', 'DISPONÍVEL', 7, 7, 110, 5, 6),
(6, '2025-07-01 15:00:00', 'DISPONÍVEL', 10, 10, 100, 6, 7),
(7, '2025-07-01 16:00:00', 'DISPONÍVEL', 6, 6, 150, 7, 8),
(8, '2025-07-02 09:30:00', 'DISPONÍVEL', 9, 9, 95, 8, 1),
(9, '2025-07-02 10:30:00', 'DISPONÍVEL', 7, 8, 85, 1, 2),
(10, '2025-07-02 14:00:00', 'CANCELADA', 0, 5, 115, 2, 3),
(11, '2025-07-03 11:00:00', 'DISPONÍVEL', 15, 15, 75, 3, 4),
(12, '2025-07-03 15:00:00', 'REALIZADA', 0, 10, 130, 4, 5),
(13, '2025-07-04 08:00:00', 'DISPONÍVEL', 8, 8, 105, 5, 6),
(14, '2025-07-04 17:00:00', 'DISPONÍVEL', 6, 6, 140, 6, 7),
(15, '2025-07-05 10:00:00', 'DISPONÍVEL', 10, 10, 90, 7, 8),
(16, '2025-07-05 14:00:00', 'REALIZADA', 0, 7, 125, 8, 1),
(17, '2025-07-06 11:30:00', 'DISPONÍVEL', 11, 11, 88, 1, 2),
(18, '2025-07-06 15:00:00', 'CANCELADA', 0, 9, 118, 2, 3),
(19, '2025-07-07 09:00:00', 'DISPONÍVEL', 14, 14, 92, 3, 4),
(20, '2025-07-07 13:00:00', 'DISPONÍVEL', 9, 9, 108, 4, 5);

--table: agendamento
INSERT INTO agendamento (id, data_hora, paciente_id, status, consulta_id) VALUES
(1, '2025-07-01 10:00:00', 1, 'CRIADO', 1),
(2, '2025-07-01 10:30:00', 1, 'CHECKIN', 2),
(3, '2025-07-01 11:00:00', 1, 'CANCELADO', 3),
(4, '2025-07-01 11:30:00', 1, 'COMPARECEU', 12),
(5, '2025-07-02 12:00:00', 1, 'FALTOU', 16),
(6, '2025-07-02 12:30:00', 1, 'CRIADO', 4),
(7, '2025-07-02 13:00:00', 1, 'CHECKIN', 5),
(8, '2025-07-02 13:30:00', 1, 'CANCELADO', 10);