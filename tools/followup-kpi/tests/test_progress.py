import unittest
from src.progress import completion_rate, remaining_hours


class ProgressTests(unittest.TestCase):
    def test_half(self):
        self.assertEqual(completion_rate(3, 6), 50.0)

    def test_empty_invalid(self):
        with self.assertRaises(ValueError):
            completion_rate(0, 0)

    def test_total(self):
        self.assertEqual(remaining_hours([{"remaining_hours": 4}, {"remaining_hours": 1.5}]), 5.5)

    def test_negative_invalid(self):
        with self.assertRaises(ValueError):
            remaining_hours([{"remaining_hours": -1}])


if __name__ == "__main__":
    unittest.main()
